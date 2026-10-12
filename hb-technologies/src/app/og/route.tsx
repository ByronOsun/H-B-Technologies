import { readFileSync } from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { PRODUCTION_CANONICAL_HOST } from "@/lib/security";
import { siteConfig } from "@/lib/site";

const size = {
  width: 1200,
  height: 630,
};

// Official logo (349×285), embedded so the image never depends on a network fetch.
const LOGO_SRC = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), "public", "vizia-logo.png")
).toString("base64")}`;

function getParam(req: NextRequest, key: string, fallback: string) {
  const value = req.nextUrl.searchParams.get(key)?.trim();
  return value || fallback;
}

export function GET(req: NextRequest) {
  const title = getParam(req, "title", siteConfig.name);
  const description = getParam(req, "description", siteConfig.description);
  const label = getParam(req, "label", siteConfig.name);
  const pagePath = getParam(req, "path", "/");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080102",
          color: "#ffffff",
          padding: "70px",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(200,16,46,0.38), rgba(255,255,255,0.02) 45%, rgba(10,80,130,0.28))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 460,
            height: 460,
            background: "rgba(200,16,46,0.22)",
            borderRadius: 460,
            transform: "translate(120px, -160px)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
            <img src={LOGO_SRC} width={98} height={80} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{siteConfig.name}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.74)" }}>
                Security-first engineering
              </div>
            </div>
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.24)",
              borderRadius: 999,
              padding: "12px 22px",
              color: "rgba(255,255,255,0.82)",
              fontSize: 20,
            }}
          >
            {label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: title.length > 54 ? 64 : 74,
              lineHeight: 1.02,
              margin: 0,
              maxWidth: 980,
              letterSpacing: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.78)",
              margin: 0,
              maxWidth: 980,
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.66)",
            fontSize: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span>{PRODUCTION_CANONICAL_HOST}</span>
          <span>{pagePath}</span>
        </div>
      </div>
    ),
    size
  );
}
