import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "public", "site-content.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "vizia-admin";

export async function GET(req: NextRequest) {
  const provided = req.headers.get("x-admin-password");
  if (provided !== null && provided !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw), {
      headers: { "Cache-Control": "no-store" },
    });
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

  try {
    await fs.writeFile(FILE, JSON.stringify(body, null, 2), "utf-8");

    // Purge Next.js cache for all public pages immediately
    const paths = ["/", "/services", "/about", "/contact", "/blog"];
    for (const p of paths) revalidatePath(p);
    // Also purge all service detail pages
    revalidatePath("/services/[slug]", "page");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Write failed — filesystem may be read-only (Vercel). Use a database for production." },
      { status: 500 }
    );
  }
}
