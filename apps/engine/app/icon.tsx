import { PRODUCTS } from "@codeloom/config";
import { ImageResponse } from "next/og";

import { PRODUCT_ID } from "../product";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const product = PRODUCTS[PRODUCT_ID];
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0c1014",
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
