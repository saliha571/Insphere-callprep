/**
 * COMPONENT TOKENS — Feedback: Toast/Sonner, Progress, Skeleton, Spinner, Tooltip
 */

// ─── Toast / Sonner ───────────────────────────────────────────────────────────

export const toast = {
  container: {
    zIndex:       "50",
    position:     "fixed" as const,
    bottom:       "var(--spacing-6)",
    right:        "var(--spacing-6)",
    gap:          "var(--spacing-2)",
    maxWidth:     "420px",
  },
  base: {
    background:   "var(--background)",
    foreground:   "var(--foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-lg)",
    paddingX:     "var(--spacing-5)",
    paddingY:     "var(--spacing-4)",
    gap:          "var(--spacing-3)",
    fontSize:     "var(--text-sm)",
  },
  variants: {
    default: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      border:     "var(--border)",
    },
    destructive: {
      background: "var(--destructive)",
      foreground: "var(--destructive-foreground)",
      border:     "var(--destructive)",
    },
    success: {
      background: "var(--success)",
      foreground: "var(--success-foreground)",
      border:     "var(--success)",
    },
  },
  title: {
    fontWeight: "var(--font-semibold)",
    lineHeight: "var(--leading-tight)",
  },
  description: {
    fontSize:   "var(--text-sm)",
    opacity:    "0.9",
    lineHeight: "var(--leading-normal)",
  },
  closeButton: {
    size:         "var(--spacing-4)",
    borderRadius: "var(--radius-full)",
    opacity:      "0.7",
    hoverOpacity: "1",
  },
} as const;

// ─── Progress ─────────────────────────────────────────────────────────────────

export const progress = {
  track: {
    background:   "var(--secondary)",
    borderRadius: "9999px",
    overflow:     "hidden" as const,
  },
  indicator: {
    background:   "var(--primary)",
    transition:   "transform 500ms ease",
  },
  sizes: {
    sm:   "var(--spacing-1)",    //  4px
    md:   "var(--spacing-2)",    //  8px
    lg:   "var(--spacing-3)",    // 12px
  },
} as const;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const skeleton = {
  background:   "var(--muted)",
  borderRadius: "var(--radius)",
  animation:    "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
} as const;

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const spinner = {
  color:      "var(--muted-foreground)",
  sizes: {
    sm:   "var(--spacing-4)",    // 16px
    md:   "var(--spacing-6)",    // 24px
    lg:   "var(--spacing-8)",    // 32px
    xl:   "var(--spacing-10)",   // 40px
  },
  animation: "spin 1s linear infinite",
} as const;

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export const tooltip = {
  content: {
    background:   "var(--primary)",
    foreground:   "var(--primary-foreground)",
    borderRadius: "var(--radius)",
    paddingX:     "var(--spacing-3)",
    paddingY:     "var(--spacing-1-5)",
    fontSize:     "var(--text-xs)",
    fontWeight:   "var(--font-medium)",
    shadow:       "var(--shadow-md)",
    zIndex:       "50",
    maxWidth:     "var(--spacing-64)",
  },
  arrow: {
    size:    "var(--spacing-2)",
    color:   "var(--primary)",
  },
} as const;

// ─── Hover Card ───────────────────────────────────────────────────────────────

export const hoverCard = {
  content: {
    background:   "var(--popover)",
    foreground:   "var(--popover-foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-md)",
    paddingX:     "var(--spacing-4)",
    paddingY:     "var(--spacing-3)",
    width:        "320px",
    zIndex:       "50",
  },
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const feedback = {
  toast,
  progress,
  skeleton,
  spinner,
  tooltip,
  hoverCard,
} as const;
