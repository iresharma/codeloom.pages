import { ImageResponse } from "next/og";
import { PRODUCTS } from "@codeloom/config";

export const alt = "CodeLoom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const product = PRODUCTS.agent;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#050507",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#a1a1aa", letterSpacing: 6 }}>COMING SOON</div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 16 }}>{product.name}</div>
        <div style={{ fontSize: 32, color: product.accent.solid, marginTop: 12 }}>{product.tagline}</div>
      </div>
    ),
    size,
  );
}
