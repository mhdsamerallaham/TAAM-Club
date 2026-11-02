import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  color?: string;
}

/**
 * TAAM Wordmark — clean hand-crafted vector SVG
 *
 * Letter anatomy (from official brand identity guide):
 *   T  — Wide crossbar. Left end has a diagonal notch (top-left corner angled),
 *         giving the left tip a pointed appearance. Stem is centered.
 *   A  — Isosceles triangle with open bottom: triangular punch-out between the
 *         two legs at the baseline. Horizontal crossbar at ~58% height.
 *   M  — Four strokes: outer vertical legs + inner diagonals descending from the
 *         top of each outer leg to a shared center valley at the baseline.
 *
 * ViewBox: 520×100
 * Uses currentColor for fill — set via CSS color or the `color` prop.
 * The A cutouts are true transparent holes using clipPath, so the logo works
 * on any background color.
 */
export function TaamLogo({ className = 'h-8 w-auto', color = 'currentColor', ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 520 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TAAM"
      role="img"
      {...props}
    >
      <defs>
        {/* ClipPath for first A: punches out the bottom triangle */}
        <clipPath id="taam-a1-clip">
          <path d="M163,0 L210,100 L192,100 L163,32 L134,100 L116,100 Z M137,58 L189,58 L189,74 L137,74 Z" />
          {/* The solid crossbar area stays, the bottom cutout is excluded via even-odd */}
        </clipPath>
        {/* ClipPath for second A */}
        <clipPath id="taam-a2-clip">
          <path d="M273,0 L320,100 L302,100 L273,32 L244,100 L226,100 Z M247,58 L299,58 L299,74 L247,74 Z" />
        </clipPath>
      </defs>

      {/* ── T ─────────────────────────────────────────────────────────── */}
      {/* Crossbar: left end angled (notch at top-left), right end flat, stem centered */}
      <path
        fill={color}
        d="M16,0 L100,0 L100,20 L72,20 L72,100 L56,100 L56,20 L0,20 Z"
      />

      {/* ── A (first) ──────────────────────────────────────────────────── */}
      {/* Full shape: outer triangle + crossbar combined, with bottom cutout via even-odd rule */}
      <path
        fill={color}
        fillRule="evenodd"
        d="
          M163,0 L210,100 L116,100 Z
          M137,74 L137,58 L189,58 L189,74 Z
          M163,58 L186,100 L140,100 Z
        "
      />

      {/* ── A (second) ─────────────────────────────────────────────────── */}
      <path
        fill={color}
        fillRule="evenodd"
        d="
          M273,0 L320,100 L226,100 Z
          M247,74 L247,58 L299,58 L299,74 Z
          M273,58 L296,100 L250,100 Z
        "
      />

      {/* ── M ──────────────────────────────────────────────────────────── */}
      {/* Outer-left vertical leg */}
      <rect fill={color} x="336" y="0" width="18" height="100" />
      {/* Inner-left diagonal */}
      <path fill={color} d="M354,0 L374,0 L447,100 L427,100 Z" />
      {/* Inner-right diagonal */}
      <path fill={color} d="M482,0 L502,0 L449,100 L429,100 Z" />
      {/* Outer-right vertical leg */}
      <rect fill={color} x="502" y="0" width="18" height="100" />
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
