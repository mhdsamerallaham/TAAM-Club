import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  color?: string;
}

/**
 * Official TAAM Wordmark — Exact vector paths extracted directly from Taam_Logo.pdf
 * ViewBox: 0 0 754.55 142.02
 */
const OFFICIAL_TAAM_LOGO_PATH =
  'M 741.62,121.17 L 754.26,141.9 L 702.3,141.81 L 715.16,121.92 L 714.83,40.57 L 647.28,141.71 L 627.7,142.02 L 560.37,40.81 L 560.09,141.98 L 512.43,141.78 L 439.15,27.79 L 364.57,141.8 L 332.71,141.96 L 259.29,27.81 L 184.63,141.9 L 154.95,141.61 L 249.32,0.14 L 301.44,0.02 L 285.5,25.14 L 348.83,120.47 L 412.63,24.99 L 396.98,0.01 L 448.78,0.12 L 533.35,127.36 L 533.59,24.09 L 518.42,0.24 L 563.85,0.17 L 637.21,114.13 L 711.82,0.13 L 754.55,0.06 L 741.7,19.98 Z ' +
  'M 126.91,141.77 L 75.16,141.87 L 87.99,121.84 L 87.77,20.89 L 38.8,21.07 L 25.71,40.34 L 0.0,0.03 L 201.0,0.03 L 174.76,40.65 L 162.14,21.0 L 114.83,21.03 L 114.77,121.9 Z ' +
  'M 466.14,141.63 L 414.09,141.83 L 440.48,101.42 Z ' +
  'M 284.64,141.69 L 232.54,141.89 L 258.91,101.49 Z ' +
  'M 663.69,0.18 L 637.39,40.54 L 611.33,0.0 Z';

export function TaamLogo({ className = 'h-8 w-auto', color = 'currentColor', ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 754.55 142.02"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TAAM"
      role="img"
      {...props}
    >
      <path fill={color} d={OFFICIAL_TAAM_LOGO_PATH} />
    </svg>
  );
}

// 6 Traditional Anatolian Kilim Motifs from the Brand Identity Guide
export function TaamMotifs({ className = 'h-5 w-auto', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} style={{ color }} aria-hidden="true">
      {/* Motif 1: Diamond with inner diamond and stems */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2 L19 12 L12 22 L5 12 Z M12 6 L8 12 L12 18 L16 12 Z" />
        <rect x="11" y="0" width="2" height="3" />
        <rect x="11" y="21" width="2" height="3" />
      </svg>

      {/* Motif 2: Roof / Arrowhead chevron */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 3 L21 12 L17.5 15.5 L12 10 L6.5 15.5 L3 12 Z M12 14 L17 19 L15 21 L12 18 L9 21 L7 19 Z" />
      </svg>

      {/* Motif 3: Pıtırak / Burdock diamond flower */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 4 L18 10 L12 16 L6 10 Z" />
        <circle cx="12" cy="1" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
        <circle cx="3" cy="10" r="1.5" />
        <circle cx="21" cy="10" r="1.5" />
      </svg>

      {/* Motif 4: Elibelinde / Star tree */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="12" cy="4" r="2.5" />
        <path d="M7 11 L12 8 L17 11 L14 13 L16 18 L12 15 L8 18 L10 13 Z" />
        <rect x="11" y="18" width="2" height="4" />
      </svg>

      {/* Motif 5: Koçboynuzu / Ram's Horn diamond hooks */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 7 L17 12 L12 17 L7 12 Z" />
        <path d="M6 8 L3 5 L5 3 L8 6 Z M18 8 L21 5 L19 3 L16 6 Z M6 16 L3 19 L5 21 L8 18 Z M18 16 L21 19 L19 21 L16 18 Z" />
      </svg>

      {/* Motif 6: Sandık / Chest ornament with side ears */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <rect x="6" y="6" width="12" height="12" rx="1" />
        <circle cx="12" cy="12" r="3" fill="var(--color-taam-blue, #002664)" />
        <path d="M3 12 L6 9 V15 Z M21 12 L18 9 V15 Z" />
      </svg>
    </div>
  );
}

export default TaamLogo;
