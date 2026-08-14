import { ImageResponse } from "next/og";
import { PRODUCTS } from "@codeloom/config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const product = PRODUCTS.agent;
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#050507",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: product.accent.solid,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    size,
  );
}
