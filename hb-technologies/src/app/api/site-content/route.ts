import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "public", "site-content.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "vizia-admin";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key || url.includes("YOUR_PROJECT_ID")) return null;
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
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", 1)
      .single();

    if (!error && data?.content) {
      return NextResponse.json(data.content, { headers: { "Cache-Control": "no-store" } });
    }
  }

  // Fallback: local file (dev)
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

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, content: body, updated_at: new Date().toISOString() });

    if (error) {
      // Return the real Supabase error so we can diagnose it
      return NextResponse.json(
        { error: `Supabase error: ${error.message} (code: ${error.code})` },
        { status: 500 }
      );
    }

    revalidateAllPages();
    return NextResponse.json({ ok: true });
  }

  // Fallback: local filesystem (dev without Supabase)
  try {
    await fs.writeFile(FILE, JSON.stringify(body, null, 2), "utf-8");
    revalidateAllPages();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No Supabase configured and filesystem is read-only. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel." },
      { status: 500 }
    );
  }
}
