/**
 * COMPONENT TOKENS — Alert / Alert-Dialog
 */

export const alertVariants = {
  default: {
    background:   "var(--background)",
    foreground:   "var(--foreground)",
    border:       "var(--border)",
    iconColor:    "var(--foreground)",
  },
  destructive: {
    background:   "var(--destructive) / 10%",
    foreground:   "var(--destructive)",
    border:       "var(--destructive) / 50%",
    iconColor:    "var(--destructive)",
  },
  success: {
    background:   "var(--success) / 10%",
    foreground:   "var(--success)",
    border:       "var(--success) / 50%",
    iconColor:    "var(--success)",
  },
  warning: {
    background:   "var(--warning) / 10%",
    foreground:   "var(--warning-foreground)",
    border:       "var(--warning) / 50%",
    iconColor:    "var(--warning)",
  },
  info: {
    background:   "var(--info) / 10%",
    foreground:   "var(--info)",
    border:       "var(--info) / 50%",
    iconColor:    "var(--info)",
  },
} as const;

export const alertBase = {
  borderRadius:   "var(--radius)",
  borderWidth:    "1px",
  paddingX:       "var(--spacing-4)",
  paddingY:       "var(--spacing-4)",
  display:        "grid",
  gridCols:       "[icon-start] auto [icon-end content-start] 1fr [content-end]",
  gap:            "var(--spacing-1)",
  colGap:         "var(--spacing-3)",
} as const;

export const alertTitle = {
  fontSize:    "var(--text-sm)",
  fontWeight:  "var(--font-semibold)",
  lineHeight:  "var(--leading-normal)",
  letterSpacing: "-0.025em",
} as const;

export const alertDescription = {
  fontSize:    "var(--text-sm)",
  lineHeight:  "var(--leading-relaxed)",
  color:       "inherit",
  opacity:     "0.9",
} as const;

export const alert = {
  base:        alertBase,
  variants:    alertVariants,
  title:       alertTitle,
  description: alertDescription,
} as const;

export type AlertVariant = keyof typeof alertVariants;
