import { PRODUCTS } from "@codeloom/config";
import { ImageResponse } from "next/og";

import { PRODUCT_ID } from "../product";

export const alt = "CodeLoom Engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const product = PRODUCTS[PRODUCT_ID];
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
          background: "#0c1014",
          color: "#ece8e1",
        }}
      >
        <div style={{ fontSize: 22, color: "#ff5c33", letterSpacing: 8 }}>UNIX · JSON-IPC · IN DEVELOPMENT</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 16 }}>{product.name}</div>
        <div style={{ fontSize: 28, color: "#f2c14e", marginTop: 12 }}>{product.tagline}</div>
      </div>
    ),
    size,
  );
}
