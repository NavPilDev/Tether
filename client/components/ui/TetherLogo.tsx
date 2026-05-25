import Image from "next/image";

interface TetherLogoProps {
  iconSize?: number;
  showWordmark?: boolean;
  wordmarkColor?: string;
  className?: string;
}

export default function TetherLogo({
  iconSize = 32,
  showWordmark = true,
  wordmarkColor = "#00D4AA",
  className = "",
}: TetherLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Chain-link icon — inline SVG matching the Figma design */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft blob background */}
        <ellipse cx="17" cy="23" rx="13" ry="9" fill="#A0EDD8" opacity="0.5" transform="rotate(-35 17 23)" />

        {/* Top-right link */}
        <g transform="rotate(-45 22 14)">
          <rect x="13" y="9" width="18" height="10" rx="5" fill="none" stroke="#00D4AA" strokeWidth="2.5" />
          <rect x="13" y="9" width="18" height="10" rx="5" fill="#00D4AA" opacity="0.15" />
        </g>

        {/* Bottom-left link (interlocked) */}
        <g transform="rotate(-45 18 26)">
          <rect x="9" y="21" width="18" height="10" rx="5" fill="none" stroke="#00D4AA" strokeWidth="2.5" />
          <rect x="9" y="21" width="18" height="10" rx="5" fill="#00D4AA" opacity="0.15" />
        </g>
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: iconSize * 0.72,
            color: wordmarkColor,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          tether
        </span>
      )}
    </div>
  );
}
