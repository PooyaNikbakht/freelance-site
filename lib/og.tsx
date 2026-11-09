import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Brand tokens from STANDARDS.md, matching the site's dark hero band.
const t = {
  background: "#0B0F14",
  ink: "#F3F4F6",
  muted: "#9AA3AF",
  border: "#232B36",
  accent: "#0F766E",
  accentBright: "#2DD4BF",
};

async function font(weight: 400 | 600) {
  // OG images are generated at build time, so reading from node_modules is fine.
  return readFile(join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
}

/** Shared Open Graph card used by every route's opengraph-image file. */
export async function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const [regular, semibold] = await Promise.all([font(400), font(600)]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: t.background,
          fontFamily: "Inter",
        }}
      >
        {/* One quiet flat shape on the right. */}
        <div style={{ position: "absolute", right: 90, top: 170, width: 240, height: 240, borderRadius: 999, border: `3px solid ${t.accent}` }} />
        <div style={{ position: "absolute", right: 170, top: 250, width: 120, height: 120, borderRadius: 16, background: t.accent }} />

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 76px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 8,
                background: t.accentBright,
                color: t.background,
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              {siteConfig.initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: t.ink }}>{siteConfig.name}</div>
              <div style={{ fontSize: 22, color: t.muted }}>{siteConfig.role}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 3, background: t.accentBright }} />
              <div style={{ fontSize: 24, color: t.accentBright, textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
            </div>
            <div style={{ display: "flex", width: 700, fontSize: title.length > 60 ? 48 : 58, fontWeight: 600, color: t.ink, lineHeight: 1.15 }}>
              {title}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: t.muted, borderTop: `1px solid ${t.border}`, paddingTop: 24 }}>
            <div>{footer ?? "Web apps, Next.js sites, and AI features"}</div>
            <div>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
          </div>
        </div>

        {/* Teal rule, matching the site footer. */}
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 8, display: "flex", background: t.accent }} />
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
