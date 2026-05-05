/**
 * COMPONENT TOKENS — Badge
 */

export const badgeVariants = {
  default: {
    background:  "var(--primary)",
    foreground:  "var(--primary-foreground)",
    border:      "transparent",
  },
  secondary: {
    background:  "var(--secondary)",
    foreground:  "var(--secondary-foreground)",
    border:      "transparent",
  },
  destructive: {
    background:  "var(--destructive)",
    foreground:  "var(--destructive-foreground)",
    border:      "transparent",
  },
  outline: {
    background:  "transparent",
    foreground:  "var(--foreground)",
    border:      "var(--border)",
  },
  success: {
    background:  "var(--success)",
    foreground:  "var(--success-foreground)",
    border:      "transparent",
  },
  warning: {
    background:  "var(--warning)",
    foreground:  "var(--warning-foreground)",
    border:      "transparent",
  },
  info: {
    background:  "var(--info)",
    foreground:  "var(--info-foreground)",
    border:      "transparent",
  },
} as const;

export const badgeBase = {
  display:        "inline-flex",
  alignItems:     "center",
  borderRadius:   "var(--radius-full)",
  paddingX:       "var(--spacing-2-5)",   // 10px
  paddingY:       "var(--spacing-0-5)",   //  2px
  fontSize:       "var(--text-xs)",
  fontWeight:     "var(--font-semibold)",
  lineHeight:     "var(--leading-normal)",
  letterSpacing:  "0.025em",
  borderWidth:    "1px",
  whiteSpace:     "nowrap" as const,
  transition:     "color 150ms, background-color 150ms",
} as const;

export const badge = { base: badgeBase, variants: badgeVariants } as const;
export type BadgeVariant = keyof typeof badgeVariants;
