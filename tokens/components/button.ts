/**
 * COMPONENT TOKENS — Button
 *
 * Maps semantic tokens to the specific button variants and sizes
 * defined by shadcn/ui. Each variant references CSS custom properties
 * so dark-mode is automatic.
 */

// ─── Variants ─────────────────────────────────────────────────────────────────

export const buttonVariants = {
  default: {
    background:         "var(--primary)",
    foreground:         "var(--primary-foreground)",
    backgroundHover:    "var(--primary) / 90%",
    border:             "transparent",
    shadow:             "var(--shadow-xs)",
  },
  destructive: {
    background:         "var(--destructive)",
    foreground:         "var(--destructive-foreground)",
    backgroundHover:    "var(--destructive) / 90%",
    border:             "transparent",
    shadow:             "var(--shadow-xs)",
  },
  outline: {
    background:         "var(--background)",
    foreground:         "var(--foreground)",
    backgroundHover:    "var(--accent)",
    foregroundHover:    "var(--accent-foreground)",
    border:             "var(--border)",
    shadow:             "var(--shadow-xs)",
  },
  secondary: {
    background:         "var(--secondary)",
    foreground:         "var(--secondary-foreground)",
    backgroundHover:    "var(--secondary) / 80%",
    border:             "transparent",
    shadow:             "var(--shadow-xs)",
  },
  ghost: {
    background:         "transparent",
    foreground:         "var(--foreground)",
    backgroundHover:    "var(--accent)",
    foregroundHover:    "var(--accent-foreground)",
    border:             "transparent",
    shadow:             "none",
  },
  link: {
    background:         "transparent",
    foreground:         "var(--primary)",
    foregroundHover:    "var(--primary)",
    textDecorationHover:"underline",
    border:             "transparent",
    shadow:             "none",
  },
} as const;

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const buttonSizes = {
  sm: {
    height:       "var(--spacing-8)",    // 32px
    paddingX:     "var(--spacing-3)",    // 12px
    paddingY:     "var(--spacing-1-5)",  //  6px
    fontSize:     "var(--text-sm)",
    borderRadius: "calc(var(--radius) - 2px)",
    gap:          "var(--spacing-1-5)",
  },
  md: {
    height:       "var(--spacing-9)",    // 36px
    paddingX:     "var(--spacing-4)",    // 16px
    paddingY:     "var(--spacing-2)",    //  8px
    fontSize:     "var(--text-sm)",
    borderRadius: "var(--radius)",
    gap:          "var(--spacing-2)",
  },
  lg: {
    height:       "var(--spacing-10)",   // 40px
    paddingX:     "var(--spacing-6)",    // 24px
    paddingY:     "var(--spacing-2-5)",  // 10px
    fontSize:     "var(--text-base)",
    borderRadius: "calc(var(--radius) + 2px)",
    gap:          "var(--spacing-2)",
  },
  icon: {
    height:       "var(--spacing-9)",
    width:        "var(--spacing-9)",
    borderRadius: "var(--radius)",
  },
} as const;

// ─── States ───────────────────────────────────────────────────────────────────

export const buttonStates = {
  disabled: {
    opacity: "0.5",
    cursor:  "not-allowed",
    pointerEvents: "none",
  },
  focus: {
    outlineOffset: "2px",
    outlineWidth:  "2px",
    outlineColor:  "var(--ring)",
  },
  loading: {
    opacity: "0.7",
    cursor:  "wait",
  },
} as const;

export const button = { variants: buttonVariants, sizes: buttonSizes, states: buttonStates } as const;
export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize    = keyof typeof buttonSizes;
