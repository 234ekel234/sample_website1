import { ImageResponse } from "next/og";

export const alt =
  "PMAFI — Philippine Military Academy Foundation, Inc.";
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
            "linear-gradient(135deg, #070f1d 0%, #16294d 50%, #0a1628 100%)",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Gold glow */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 220,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(200, 169, 81, 0.18)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 70,
            right: 200,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(27, 42, 74, 0.6)",
            filter: "blur(80px)",
          }}
        />

        {/* Emblem */}
        <div
          style={{
            display: "flex",
            width: 168,
            height: 168,
            borderRadius: 9999,
            background: "#1B2A4A",
            border: "5px solid #C8A951",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 44,
            boxShadow: "0 0 60px rgba(200,169,81,0.25)",
          }}
        >
          <svg width="118" height="118" viewBox="0 -3 64 64">
            <path
              d="M32 15.5 L35.6 25.8 L46.5 26.1 L37.7 32.6 L40.9 43.1 L32 36.8 L23.1 43.1 L26.3 32.6 L17.5 26.1 L28.4 25.8 Z"
              fill="#C8A951"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -2,
            color: "white",
          }}
        >
          PMAFI
        </div>

        {/* Full name */}
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            color: "#cbd5e1",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 940,
          }}
        >
          Philippine Military Academy Foundation, Inc.
        </div>

        {/* Slogan */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 22,
            color: "#C8A951",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          Building Leaders · Sustaining Excellence · Serving the Nation
        </div>
      </div>
    ),
    { ...size }
  );
}
