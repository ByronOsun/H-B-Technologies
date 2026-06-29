import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "vizia-admin";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const vars = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `set (${url.slice(0, 30)}...)` : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: key ? `set (${key.slice(0, 20)}...)` : "MISSING",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "set" : "using default",
    INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET ? "set" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  };

  let dbTest = "skipped (Supabase not configured)";
  if (url && key) {
    try {
      const sb = createClient(url, key, { auth: { persistSession: false } });
      const { data, error } = await sb.from("site_content").select("id").limit(1);
      dbTest = error ? `ERROR: ${error.message} (${error.code})` : `OK — rows: ${data?.length ?? 0}`;
    } catch (e) {
      dbTest = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json({ vars, dbTest });
}
