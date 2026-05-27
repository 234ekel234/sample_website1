import { ImageResponse } from "next/og";

export const alt = "Tusi Solutions — Your Trusted Business Partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #172554 50%, #0f172a 100%)",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 200,
            width: 400,
            height: 400,
            borderRadius: 9999,
            background: "rgba(37, 99, 235, 0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 180,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(30, 64, 175, 0.25)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            background: "rgba(59, 130, 246, 0.15)",
            border: "1px solid rgba(96, 165, 250, 0.4)",
            borderRadius: 9999,
            padding: "10px 24px",
            color: "#93c5fd",
            fontSize: 22,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 36,
          }}
        >
          Trusted Business Partner
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -3,
            color: "white",
          }}
        >
          <span>Tusi</span>
          <span style={{ color: "#60a5fa" }}>Solutions</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 36,
            color: "#cbd5e1",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Honest service. Quality products. Real people you can talk to.
        </div>
      </div>
    ),
    { ...size }
  );
}
