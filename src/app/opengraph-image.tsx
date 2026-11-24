import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "linear-gradient(135deg,#000 0%,#111113 60%,#0b2340 100%)", color: "#f5f5f7" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f5f5f7", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{site.initials}</div>
          <div style={{ fontSize: 32, fontWeight: 600 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
          {site.heroTitle.map((l, i) => (<span key={l} style={{ color: i === 2 ? "#a1a1a6" : "#f5f5f7" }}>{l}</span>))}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a1a1a6" }}>{`${site.headline} · Software · Cloud · Data · DevOps · Automation`}</div>
      </div>
    ),
    size,
  );
}
