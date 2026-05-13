import { NextResponse } from "next/server";

function getBackendApiUrl() {
  return process.env.API_URL ?? "";
}

export async function POST(req: Request) {
  const backend = getBackendApiUrl();
  if (!backend) {
    return NextResponse.json(
      {
        error: "API_URL_NOT_CONFIGURED",
        message:
          "Server is missing API_URL. Set it in your deployment environment.",
      },
      { status: 500 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "UNSUPPORTED_MEDIA_TYPE" },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const siteOrigin = siteUrlRaw.replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(`${backend}/consultation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward a minimal user agent for diagnostics.
        "User-Agent": "hb-technologies-frontend/1.0",
        ...(siteOrigin
          ? {
              Origin: siteOrigin,
              Referer: `${siteOrigin}/`,
            }
          : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();

    return new NextResponse(text || "", {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "text/plain",
      },
    });
  } catch {
    return NextResponse.json({ error: "UPSTREAM_UNAVAILABLE" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
