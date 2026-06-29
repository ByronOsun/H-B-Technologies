import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "public", "site-content.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "vizia-admin";
const BUCKET = "vizia-media";
const STORAGE_PATH = "admin/site-content.json";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function revalidateAllPages() {
  const paths = ["/", "/services", "/about", "/contact", "/blog"];
  for (const p of paths) revalidatePath(p);
  revalidatePath("/services/[slug]", "page");
}

export async function GET(req: NextRequest) {
  const provided = req.headers.get("x-admin-password");
  if (provided !== null && provided !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase.storage.from(BUCKET).download(STORAGE_PATH);
      if (!error && data) {
        const text = await data.text();
        return NextResponse.json(JSON.parse(text), { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      // Fall through to local file
    }
  }

  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const jsonStr = JSON.stringify(body, null, 2);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(STORAGE_PATH, blob, { upsert: true, contentType: "application/json" });
      if (!error) {
        revalidateAllPages();
        return NextResponse.json({ ok: true });
      }
    } catch {
      // Fall through to local write
    }
  }

  try {
    await fs.writeFile(FILE, jsonStr, "utf-8");
    revalidateAllPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Write failed — add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables." },
      { status: 500 }
    );
  }
}
