/**
 * PMAFI emblem — a self-contained navy/gold seal designed to stay crisp at any
 * size (the original brochure scan was too low-res to extract). The fixed navy
 * disc + gold ring keeps good contrast on both light and dark backgrounds.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Philippine Military Academy Foundation emblem"
    >
      <defs>
        <linearGradient id="pmafi-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D080" />
          <stop offset="50%" stopColor="#C8A951" />
          <stop offset="100%" stopColor="#A07830" />
        </linearGradient>
      </defs>

      {/* Navy field */}
      <circle cx="32" cy="32" r="30" fill="#1B2A4A" />
      {/* Outer + inner gold rings */}
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#pmafi-gold)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="#C8A951" strokeWidth="1" strokeOpacity="0.45" />

      {/* Five-point star */}
      <path
        d="M32 15.5 L35.6 25.8 L46.5 26.1 L37.7 32.6 L40.9 43.1 L32 36.8 L23.1 43.1 L26.3 32.6 L17.5 26.1 L28.4 25.8 Z"
        fill="url(#pmafi-gold)"
      />

      {/* Founding-year base mark */}
      <text
        x="32"
        y="51.5"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="0.5"
        fill="#C8A951"
        fontFamily="var(--font-sans, sans-serif)"
      >
        EST. 1988
      </text>
    </svg>
  );
}
