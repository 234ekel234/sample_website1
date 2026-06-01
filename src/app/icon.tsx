import { ImageResponse } from "next/og";

// Favicon — simplified PMAFI seal (navy disc + gold ring + star) that stays
// legible at small sizes; the "EST. 1988" text is dropped vs. the full emblem.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B2A4A",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "82%",
            height: "82%",
            borderRadius: 9999,
            border: "3px solid #C8A951",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="40" height="40" viewBox="0 -3 64 64">
            <path
              d="M32 15.5 L35.6 25.8 L46.5 26.1 L37.7 32.6 L40.9 43.1 L32 36.8 L23.1 43.1 L26.3 32.6 L17.5 26.1 L28.4 25.8 Z"
              fill="#C8A951"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
