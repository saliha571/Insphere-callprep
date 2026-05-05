/**
 * COMPONENT TOKENS — Navigation: Tabs, Navigation Menu, Sidebar, Breadcrumb
 */

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const tabs = {
  list: {
    background:   "var(--muted)",
    foreground:   "var(--muted-foreground)",
    borderRadius: "calc(var(--radius) - 2px)",
    padding:      "var(--spacing-1)",
    height:       "var(--spacing-9)",
    gap:          "0",
  },
  trigger: {
    paddingX:          "var(--spacing-3)",
    paddingY:          "var(--spacing-1-5)",
    fontSize:          "var(--text-sm)",
    fontWeight:        "var(--font-medium)",
    borderRadius:      "calc(var(--radius) - 4px)",
    transition:        "all 150ms ease",
    active: {
      background:  "var(--background)",
      foreground:  "var(--foreground)",
      shadow:      "var(--shadow-sm)",
    },
    disabled: {
      opacity:    "0.5",
      cursor:     "not-allowed",
    },
  },
  content: {
    marginTop:    "var(--spacing-2)",
    focus: {
      ring:         "0 0 0 2px var(--ring)",
      ringOffset:   "2px",
    },
  },
} as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const sidebar = {
  width:           "var(--spacing-64)",    // 256px expanded
  widthCollapsed:  "var(--spacing-12)",    //  48px icon-only
  background:      "var(--sidebar)",
  foreground:      "var(--sidebar-foreground)",
  border:          "var(--sidebar-border)",
  borderWidth:     "1px",

  header: {
    height:     "var(--spacing-16)",   // 64px
    paddingX:   "var(--spacing-4)",
    paddingY:   "var(--spacing-3)",
  },

  item: {
    height:          "var(--spacing-8)",   // 32px
    paddingX:        "var(--spacing-3)",
    borderRadius:    "calc(var(--radius) - 2px)",
    fontSize:        "var(--text-sm)",
    fontWeight:      "var(--font-medium)",
    gap:             "var(--spacing-2)",
    color:           "var(--sidebar-foreground)",
    hover: {
      background:    "var(--sidebar-accent)",
      foreground:    "var(--sidebar-accent-foreground)",
    },
    active: {
      background:    "var(--sidebar-primary)",
      foreground:    "var(--sidebar-primary-foreground)",
    },
  },

  group: {
    paddingX:    "var(--spacing-2)",
    paddingY:    "var(--spacing-2)",
    gap:         "var(--spacing-1)",
    label: {
      fontSize:     "var(--text-xs)",
      fontWeight:   "var(--font-medium)",
      color:        "var(--sidebar-foreground) / 70%",
      paddingX:     "var(--spacing-3)",
      height:       "var(--spacing-8)",
      letterSpacing:"0.05em",
      textTransform:"uppercase" as const,
    },
  },

  footer: {
    height:      "var(--spacing-16)",
    paddingX:    "var(--spacing-4)",
    paddingY:    "var(--spacing-3)",
    border:      "var(--sidebar-border)",
    borderWidth: "1px 0 0 0",
  },
} as const;

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export const breadcrumb = {
  item: {
    fontSize:    "var(--text-sm)",
    fontWeight:  "var(--font-normal)",
    color:       "var(--muted-foreground)",
    hover: {
      color:   "var(--foreground)",
    },
  },
  separator: {
    color:       "var(--muted-foreground)",
    fontSize:    "var(--text-sm)",
    marginX:     "var(--spacing-1)",
  },
  active: {
    color:       "var(--foreground)",
    fontWeight:  "var(--font-medium)",
    cursor:      "default",
  },
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const pagination = {
  item: {
    height:      "var(--spacing-9)",
    width:       "var(--spacing-9)",
    borderRadius:"var(--radius)",
    fontSize:    "var(--text-sm)",
    fontWeight:  "var(--font-medium)",
    border:      "var(--border)",
    borderWidth: "1px",
    hover: {
      background: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    active: {
      background: "var(--primary)",
      foreground: "var(--primary-foreground)",
      border:     "transparent",
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
  },
  ellipsis: {
    width:    "var(--spacing-9)",
    height:   "var(--spacing-9)",
    display:  "flex",
    alignItems: "center",
    justifyContent: "center",
  },
} as const;

export const navigation = { tabs, sidebar, breadcrumb, pagination } as const;
