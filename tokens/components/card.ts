/**
 * COMPONENT TOKENS — Card
 */

export const cardTokens = {
  background:    "var(--card)",
  foreground:    "var(--card-foreground)",
  border:        "var(--border)",
  borderWidth:   "1px",
  borderRadius:  "calc(var(--radius) + 2px)",  // slightly more rounded than inputs
  shadow:        "var(--shadow-sm)",
  padding:       "var(--spacing-6)",            // 24px all sides

  header: {
    paddingX:    "var(--spacing-6)",
    paddingTop:  "var(--spacing-6)",
    paddingBottom:"var(--spacing-0)",
    gap:         "var(--spacing-1-5)",
  },

  title: {
    fontSize:    "var(--text-xl)",
    fontWeight:  "var(--font-semibold)",
    lineHeight:  "var(--leading-tight)",
    letterSpacing: "-0.025em",
  },

  description: {
    fontSize:    "var(--text-sm)",
    color:       "var(--muted-foreground)",
    lineHeight:  "var(--leading-normal)",
  },

  content: {
    paddingX:    "var(--spacing-6)",
    paddingTop:  "var(--spacing-6)",
    paddingBottom:"var(--spacing-0)",
  },

  footer: {
    paddingX:    "var(--spacing-6)",
    paddingY:    "var(--spacing-6)",
    display:     "flex",
    alignItems:  "center",
  },

  // Elevation variants
  variants: {
    flat: {
      shadow:  "none",
      border:  "var(--border)",
    },
    raised: {
      shadow:  "var(--shadow-sm)",
      border:  "var(--border)",
    },
    ghost: {
      shadow:  "none",
      border:  "transparent",
      background: "transparent",
    },
  },
} as const;

export const card = cardTokens;
