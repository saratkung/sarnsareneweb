"use client";

// ============================================================
// SARNSARENE — crafting animation stage scenes.
//
// Each stage draws into the shared <svg viewBox="0 0 300 230">.
// Every stage is a one-shot: it plays a single mount animation
// scaled to `d` seconds (its slot in the master timeline), then
// the parent swaps to the next stage. No shared clock, no
// per-frame plumbing — framer's own `animate` does the work.
// ============================================================

import { motion } from "framer-motion";
import { BRASS, BRASS_SOFT, INK, INK_FAINT, INK_SOFT, LINEN, PAPER } from "./timeline";

type P = { d: number }; // stage duration, seconds

const EASE = [0.4, 0, 0.2, 1] as const;
// rotate/scale about the element's own centre — universally supported
const spin = { transformBox: "fill-box", transformOrigin: "center" } as const;

export function CraftDefs() {
  return (
    <defs>
      <pattern id="sr-weave" width="7" height="7" patternUnits="userSpaceOnUse">
        <path d="M0 3.5H7M3.5 0V7" stroke={INK} strokeWidth="0.4" opacity="0.12" />
      </pattern>
      <linearGradient id="sr-sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

// =========================================================================
// 01 — MATERIAL
// =========================================================================

export function MaterialStage({ d }: P) {
  return (
    <g>
      <motion.g
        style={spin}
        initial={{ scaleY: 0.12 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: d * 0.6, ease: EASE }}
      >
        <rect x="86" y="66" width="128" height="98" rx="3" fill={PAPER} stroke={INK_FAINT} />
        <rect x="86" y="66" width="128" height="98" rx="3" fill="url(#sr-weave)" />
        <line x1="86" y1="72" x2="214" y2="72" stroke={INK_FAINT} />
        <line x1="86" y1="158" x2="214" y2="158" stroke={INK_FAINT} />
        <motion.line
          x1="150" y1="66" x2="150" y2="164"
          stroke={INK_FAINT} strokeDasharray="2 3"
          initial={{ opacity: 1 }} animate={{ opacity: 0 }}
          transition={{ duration: d * 0.5, delay: d * 0.15 }}
        />
      </motion.g>

      <motion.g
        stroke={INK_SOFT}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: d * 0.4, delay: d * 0.45 }}
      >
        {[100, 128, 156, 184, 208].map((x, i) => (
          <line key={x} x1={x} y1="58" x2={x} y2={i === 2 ? 50 : 54} strokeWidth="0.8" />
        ))}
        <text x="150" y="46" textAnchor="middle" fontSize="6" fill={INK_SOFT} letterSpacing="1">
          34 CM
        </text>
      </motion.g>
    </g>
  );
}

// =========================================================================
// 02 — CUTTING
// =========================================================================

export function CuttingStage({ d }: P) {
  const piece = (to: { x?: number; y?: number }, delay: number) => ({
    initial: { x: 0, y: 0 },
    animate: { x: 0, y: 0, ...to },
    transition: { duration: d * 0.4, delay: delay * d, ease: EASE },
  });
  return (
    <g>
      <rect x="86" y="66" width="128" height="98" rx="3" fill={PAPER} stroke={INK_FAINT} />
      <rect x="86" y="66" width="128" height="98" rx="3" fill="url(#sr-weave)" />

      <rect x="118" y="80" width="64" height="70" rx="2" fill="none" stroke={INK_SOFT} strokeDasharray="3 3" />
      <motion.rect x="96" y="86" width="16" height="58" rx="2" fill="none" stroke={INK_SOFT} strokeDasharray="3 3" {...piece({ x: -9 }, 0.28)} />
      <motion.rect x="188" y="86" width="16" height="58" rx="2" fill="none" stroke={INK_SOFT} strokeDasharray="3 3" {...piece({ x: 9 }, 0.42)} />
      <motion.rect x="124" y="70" width="52" height="7" rx="3.5" fill="none" stroke={INK_SOFT} strokeDasharray="3 3" {...piece({ y: -7 }, 0.55)} />
      <motion.rect x="120" y="152" width="60" height="8" rx="2" fill="none" stroke={INK_SOFT} strokeDasharray="3 3" {...piece({ y: 8 }, 0.15)} />

      <motion.g
        initial={{ x: 78, opacity: 0 }}
        animate={{ x: [78, 78, 226, 226], opacity: [0, 1, 1, 0] }}
        transition={{ duration: d * 0.85, times: [0, 0.08, 0.85, 1], ease: EASE }}
      >
        <line x1="0" y1="58" x2="0" y2="172" stroke={BRASS} strokeWidth="1" />
        <circle cx="0" cy="58" r="1.6" fill={BRASS} />
      </motion.g>
    </g>
  );
}

// =========================================================================
// 03 — STITCHING  (hero)
// =========================================================================

const TOTE_PATH =
  "M100 66 L200 66 Q208 66 209 76 L215 150 Q216 165 200 168 L100 168 Q84 165 85 150 L91 76 Q92 66 100 66 Z";

export function StitchingStage({ d }: P) {
  return (
    <g>
      <defs>
        <mask id="sr-stitch-reveal">
          <motion.path
            d={TOTE_PATH} fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: d * 0.9, ease: "linear" }}
          />
        </mask>
      </defs>

      <path d={TOTE_PATH} fill="none" stroke={INK_FAINT} strokeWidth="1" />

      <g mask="url(#sr-stitch-reveal)">
        <path
          d={TOTE_PATH} fill="none" stroke={BRASS} strokeWidth="1.7"
          strokeLinecap="round" strokeDasharray="2.4 4.6"
        />
      </g>

      {/* needle rides the perimeter via CSS motion path
          (offset-rotate defaults to `auto` — it follows the tangent) */}
      <motion.g
        style={{ offsetPath: `path("${TOTE_PATH}")` } as React.CSSProperties}
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
        transition={{
          offsetDistance: { duration: d * 0.9, ease: "linear" },
          opacity: { duration: d, times: [0, 0.05, 0.92, 1] },
        }}
      >
        <path d="M0 -11 L2 0 L0 11 L-2 0 Z" fill={INK} />
        <circle cx="0" cy="-6.5" r="1" fill={PAPER} />
        <path d="M0 11 q4 5 1.5 10 q-3 4 -7 1.5" fill="none" stroke={BRASS_SOFT} strokeWidth="1" />
      </motion.g>
    </g>
  );
}

// =========================================================================
// 04 — ASSEMBLY
// =========================================================================

export function AssemblyStage({ d }: P) {
  const t = { duration: d * 0.85, ease: EASE };
  return (
    <g>
      <motion.rect
        x="112" y="70" width="76" height="86" rx="4" fill={LINEN} stroke={INK_FAINT} style={spin}
        initial={{ y: -46, scale: 0.8, opacity: 0 }}
        animate={{ y: -7, scale: 0.95, opacity: 0.45 }}
        transition={t}
      />
      <motion.path
        d="M110 78 L120 74 L120 152 L110 156 Z" fill={PAPER} stroke={INK_FAINT}
        initial={{ x: -58, skewY: -8 }} animate={{ x: 0, skewY: 0 }} transition={t}
      />
      <motion.path
        d="M180 74 L190 78 L190 156 L180 152 Z" fill={PAPER} stroke={INK_FAINT}
        initial={{ x: 58, skewY: 8 }} animate={{ x: 0, skewY: 0 }} transition={t}
      />
      <motion.ellipse
        cx="150" cy="160" rx="42" ry="7" fill={LINEN} stroke={INK_FAINT} style={spin}
        initial={{ y: 52, scaleX: 0.6 }} animate={{ y: 0, scaleX: 1 }} transition={t}
      />
      <motion.g initial={{ y: 6 }} animate={{ y: 0 }} transition={t}>
        <rect x="112" y="72" width="76" height="86" rx="4" fill={PAPER} stroke={INK_SOFT} />
        <rect x="112" y="72" width="76" height="86" rx="4" fill="url(#sr-weave)" />
      </motion.g>
      <motion.g
        fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: d * 0.5, delay: d * 0.4, ease: EASE }}
      >
        <path d="M124 74 q0 -22 13 -22 q13 0 13 22" />
        <path d="M150 74 q0 -22 13 -22 q13 0 13 22" />
      </motion.g>
    </g>
  );
}

// =========================================================================
// shared finished tote
// =========================================================================

function FinishedTote() {
  return (
    <g>
      <ellipse cx="150" cy="160" rx="42" ry="7" fill={LINEN} stroke={INK_FAINT} />
      <path d="M110 80 L120 76 L120 152 L110 156 Z" fill={PAPER} stroke={INK_FAINT} />
      <path d="M180 76 L190 80 L190 156 L180 152 Z" fill={PAPER} stroke={INK_FAINT} />
      <rect x="112" y="74" width="76" height="84" rx="4" fill={PAPER} stroke={INK_SOFT} />
      <rect x="112" y="74" width="76" height="84" rx="4" fill="url(#sr-weave)" />
      <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
        <path d="M124 76 q0 -22 13 -22 q13 0 13 22" />
        <path d="M150 76 q0 -22 13 -22 q13 0 13 22" />
      </g>
      <path
        d="M115 78 L185 78 M115 154 L185 154 M115 78 L115 154 M185 78 L185 154"
        fill="none" stroke={BRASS} strokeWidth="0.9" strokeDasharray="0.5 4"
      />
    </g>
  );
}

// =========================================================================
// 05 — QUALITY CHECK
// =========================================================================

export function QualityCheckStage({ d }: P) {
  const detail = (delay: number) => ({
    initial: { opacity: 0, scale: 0.4 },
    animate: { opacity: [0, 1, 0], scale: [0.4, 1.1, 0.9] },
    transition: { duration: d * 0.35, delay: delay * d, ease: EASE },
  });
  return (
    <g>
      <motion.g
        style={spin}
        initial={{ rotate: -2.5 }}
        animate={{ rotate: [-2.5, 3, 0] }}
        transition={{ duration: d, ease: EASE }}
      >
        <FinishedTote />
        <motion.circle cx="115" cy="154" r="3" fill="none" stroke={BRASS} {...detail(0.15)} />
        <motion.circle cx="185" cy="154" r="3" fill="none" stroke={BRASS} {...detail(0.3)} />
        <motion.circle cx="150" cy="55" r="3" fill="none" stroke={BRASS} {...detail(0.45)} />
        <motion.text
          x="150" y="120" textAnchor="middle" fontSize="6.5" letterSpacing="2.5" fill={INK_SOFT}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: d * 0.3, delay: d * 0.55 }}
        >
          SARNSARENE
        </motion.text>
      </motion.g>

      <motion.line
        x1="96" x2="204" stroke={BRASS} strokeWidth="1"
        initial={{ y: 52, opacity: 0 }}
        animate={{ y: [52, 52, 176, 176], opacity: [0, 0.55, 0.55, 0] }}
        transition={{ duration: d * 0.85, times: [0, 0.1, 0.8, 1], ease: EASE }}
      />
    </g>
  );
}

// =========================================================================
// 06 — PACKING
// =========================================================================

export function PackingStage({ d }: P) {
  return (
    <g>
      <motion.g
        style={spin}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: d * 0.22 }}
      >
        <FinishedTote />
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: d * 0.5, times: [0, 0.16, 0.8, 1] }}
      >
        <path
          d="M118 92 Q116 84 128 82 L172 82 Q184 84 182 92 L188 158 Q189 170 176 172 L124 172 Q111 170 112 158 Z"
          fill={LINEN} stroke={INK_FAINT}
        />
        <path d="M126 84 Q150 78 174 84" fill="none" stroke={INK_SOFT} strokeWidth="1" />
        <text x="150" y="128" textAnchor="middle" fontSize="6" letterSpacing="2.5" fill={INK_SOFT}>
          SARNSARENE
        </text>
      </motion.g>

      <motion.g
        stroke={INK_FAINT} strokeWidth="1"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: [-60, 0, 60], opacity: [0, 1, 0] }}
        transition={{ duration: d * 0.28, delay: d * 0.28, ease: EASE }}
      >
        <line x1="70" y1="70" x2="130" y2="170" />
        <line x1="90" y1="66" x2="150" y2="176" />
        <line x1="110" y1="66" x2="168" y2="176" />
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d * 0.15, delay: d * 0.5 }}>
        <path d="M108 118 L192 118 L192 172 L108 172 Z" fill={PAPER} stroke={INK_SOFT} />
        <path d="M108 118 L124 104 L208 104 L192 118 Z" fill={LINEN} stroke={INK_SOFT} />
        <path d="M192 118 L208 104 L208 158 L192 172 Z" fill={LINEN} stroke={INK_SOFT} />
        <motion.path
          d="M108 118 L124 104 L208 104 L192 118 Z" fill={PAPER} stroke={INK_SOFT}
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          initial={{ scaleY: 0, opacity: 0.6 }} animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: d * 0.32, delay: d * 0.55, ease: EASE }}
        />
        <motion.text
          x="150" y="150" textAnchor="middle" fontSize="7" letterSpacing="3" fill={INK_SOFT}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: d * 0.15, delay: d * 0.86 }}
        >
          SARNSARENE
        </motion.text>
      </motion.g>
    </g>
  );
}

// =========================================================================
// 07 — READY
// =========================================================================

export function ReadyStage({ d }: P) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: d * 0.18 }}>
      <motion.g
        style={spin}
        animate={{ scale: [1, 1.014, 1] }}
        transition={{ duration: d, ease: EASE }}
      >
        <path d="M108 118 L192 118 L192 172 L108 172 Z" fill={PAPER} stroke={INK_SOFT} />
        <path d="M108 118 L124 104 L208 104 L192 118 Z" fill={LINEN} stroke={INK_SOFT} />
        <path d="M192 118 L208 104 L208 158 L192 172 Z" fill={LINEN} stroke={INK_SOFT} />
        <text x="150" y="150" textAnchor="middle" fontSize="7" letterSpacing="3" fill={INK_SOFT}>
          SARNSARENE
        </text>
        <line x1="150" y1="104" x2="150" y2="172" stroke={BRASS} strokeWidth="1.4" />
        <line x1="129" y1="111" x2="171" y2="111" stroke={BRASS} strokeWidth="1.4" />
      </motion.g>

      <motion.rect
        y="90" width="34" height="100" fill="url(#sr-sheen)"
        initial={{ x: -60 }} animate={{ x: 360 }}
        transition={{ duration: d * 0.7, delay: d * 0.1, ease: EASE }}
        style={{ transformBox: "fill-box", transformOrigin: "center", rotate: 14 }}
      />
      <text x="150" y="208" textAnchor="middle" fontSize="7" fill={INK_SOFT}>
        ◆
      </text>
    </motion.g>
  );
}

// ---- static finished piece (reduced motion / other statuses) ------------

export function StaticFinishedBag() {
  return (
    <svg viewBox="0 0 300 230" className="w-full" aria-hidden>
      <CraftDefs />
      <g transform="translate(0 6)">
        <FinishedTote />
      </g>
    </svg>
  );
}
