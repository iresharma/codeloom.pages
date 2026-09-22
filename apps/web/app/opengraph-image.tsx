import { ImageResponse } from "next/og";

export const alt = "CodeLoom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 22, color: "#ff5c33", letterSpacing: 8 }}>ENGINE · CLOUD CONTROLLER · CLIENTS</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 16 }}>CodeLoom</div>
        <div style={{ fontSize: 28, color: "#f2c14e", marginTop: 12 }}>
          One engine. One protocol. As many clients as you want.
        </div>
      </div>
    ),
    size,
  );
}
