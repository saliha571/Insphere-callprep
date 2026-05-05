/**
 * COMPONENT TOKENS — Data Display: Table, Avatar, Accordion, Separator, Chart
 */

// ─── Table ────────────────────────────────────────────────────────────────────

export const table = {
  container: {
    width:      "100%",
    overflow:   "auto" as const,
  },
  root: {
    width:         "100%",
    captionSide:   "bottom" as const,
    fontSize:      "var(--text-sm)",
    borderCollapse:"collapse" as const,
  },
  header: {
    background:        "var(--muted) / 50%",
    borderBottom:      "1px solid var(--border)",
  },
  headerCell: {
    height:         "var(--spacing-10)",
    paddingX:       "var(--spacing-4)",
    textAlign:      "left" as const,
    fontWeight:     "var(--font-medium)",
    color:          "var(--muted-foreground)",
    verticalAlign:  "middle" as const,
    whiteSpace:     "nowrap" as const,
    sortable: {
      cursor:     "pointer" as const,
      userSelect: "none" as const,
      gap:        "var(--spacing-2)",
    },
  },
  row: {
    borderBottom:    "1px solid var(--border)",
    transition:      "background-color 150ms ease",
    hover: {
      background: "var(--muted) / 50%",
    },
    selected: {
      background: "var(--muted)",
    },
  },
  cell: {
    paddingX:      "var(--spacing-4)",
    paddingY:      "var(--spacing-3)",
    verticalAlign: "middle" as const,
    lineHeight:    "var(--leading-normal)",
  },
  footer: {
    background:  "var(--muted) / 50%",
    borderTop:   "1px solid var(--border)",
    fontWeight:  "var(--font-medium)",
  },
  caption: {
    marginTop:  "var(--spacing-2)",
    fontSize:   "var(--text-sm)",
    color:      "var(--muted-foreground)",
    textAlign:  "center" as const,
  },
} as const;

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const avatar = {
  sizes: {
    xs:  "var(--spacing-6)",    // 24px
    sm:  "var(--spacing-8)",    // 32px
    md:  "var(--spacing-10)",   // 40px
    lg:  "var(--spacing-12)",   // 48px
    xl:  "var(--spacing-16)",   // 64px
    "2xl": "var(--spacing-20)", // 80px
  },
  base: {
    borderRadius:  "9999px",
    overflow:      "hidden" as const,
    display:       "flex",
    alignItems:    "center",
    justifyContent:"center",
  },
  image: {
    width:  "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  fallback: {
    background:  "var(--muted)",
    foreground:  "var(--muted-foreground)",
    fontSize:    "var(--text-sm)",
    fontWeight:  "var(--font-medium)",
    userSelect:  "none" as const,
  },
  group: {
    overlap: "calc(var(--spacing-2) * -1)",
    ring:    "2px solid var(--background)",
  },
} as const;

// ─── Accordion ────────────────────────────────────────────────────────────────

export const accordion = {
  item: {
    borderBottom:  "1px solid var(--border)",
  },
  trigger: {
    display:       "flex",
    justifyContent:"space-between" as const,
    alignItems:    "center",
    paddingY:      "var(--spacing-4)",
    paddingX:      "var(--spacing-0)",
    fontSize:      "var(--text-sm)",
    fontWeight:    "var(--font-medium)",
    gap:           "var(--spacing-4)",
    width:         "100%",
    textAlign:     "left" as const,
    transition:    "all 150ms ease",
    hover: {
      textDecoration: "underline",
    },
    chevron: {
      size:        "var(--spacing-4)",
      flexShrink:  "0",
      transition:  "transform 200ms ease",
      open:        "rotate(180deg)",
    },
  },
  content: {
    overflow:      "hidden" as const,
    fontSize:      "var(--text-sm)",
    paddingBottom: "var(--spacing-4)",
    paddingTop:    "var(--spacing-0)",
    lineHeight:    "var(--leading-relaxed)",
    color:         "var(--muted-foreground)",
  },
} as const;

// ─── Separator ────────────────────────────────────────────────────────────────

export const separator = {
  horizontal: {
    height:     "1px",
    width:      "100%",
    background: "var(--border)",
    marginY:    "var(--spacing-4)",
  },
  vertical: {
    width:      "1px",
    height:     "100%",
    background: "var(--border)",
    marginX:    "var(--spacing-4)",
    display:    "inline-block" as const,
    verticalAlign: "middle" as const,
  },
} as const;

// ─── Scroll Area ──────────────────────────────────────────────────────────────

export const scrollArea = {
  viewport: {
    width:    "100%",
    height:   "100%",
    borderRadius: "inherit",
  },
  scrollbar: {
    display:     "flex",
    userSelect:  "none" as const,
    touchAction: "none" as const,
    padding:     "1px",
    transition:  "colors 150ms ease",
    vertical: {
      width:        "var(--spacing-2-5)",
      height:       "100%",
      borderLeft:   "1px solid transparent",
    },
    horizontal: {
      height:       "var(--spacing-2-5)",
      flexDir:      "column",
      borderTop:    "1px solid transparent",
    },
  },
  thumb: {
    background:   "var(--border)",
    borderRadius: "9999px",
    flex:         "1",
    position:     "relative" as const,
  },
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const dataDisplay = {
  table,
  avatar,
  accordion,
  separator,
  scrollArea,
} as const;
