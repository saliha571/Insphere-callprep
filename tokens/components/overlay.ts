/**
 * COMPONENT TOKENS — Overlay: Dropdown Menu, Context Menu, Popover, Command, Combobox
 */

// ─── Dropdown / Context Menu ──────────────────────────────────────────────────

export const menu = {
  content: {
    background:   "var(--popover)",
    foreground:   "var(--popover-foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-md)",
    padding:      "var(--spacing-1)",
    minWidth:     "8rem",
    zIndex:       "50",
    overflow:     "hidden" as const,
  },
  item: {
    display:      "flex",
    alignItems:   "center",
    gap:          "var(--spacing-2)",
    borderRadius: "calc(var(--radius) - 4px)",
    paddingX:     "var(--spacing-2)",
    paddingY:     "var(--spacing-1-5)",
    fontSize:     "var(--text-sm)",
    cursor:       "default" as const,
    userSelect:   "none" as const,
    focus: {
      background: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    destructive: {
      foreground: "var(--destructive)",
      focus: {
        background: "var(--destructive)",
        foreground: "var(--destructive-foreground)",
      },
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
    inset: {
      paddingLeft: "var(--spacing-8)",
    },
  },
  label: {
    paddingX:    "var(--spacing-2)",
    paddingY:    "var(--spacing-1-5)",
    fontSize:    "var(--text-xs)",
    fontWeight:  "var(--font-semibold)",
    color:       "var(--muted-foreground)",
  },
  separator: {
    height:     "1px",
    background: "var(--border)",
    marginX:    "calc(var(--spacing-1) * -1)",
    marginY:    "var(--spacing-1)",
  },
  shortcut: {
    marginLeft: "auto",
    fontSize:   "var(--text-xs)",
    color:      "var(--muted-foreground)",
    letterSpacing: "0.1em",
  },
  checkboxItem: {
    paddingLeft: "var(--spacing-8)",
    position:    "relative" as const,
  },
  radioItem: {
    paddingLeft: "var(--spacing-8)",
    position:    "relative" as const,
  },
  sub: {
    trigger: {
      gap:         "var(--spacing-2)",
      chevronSize: "var(--spacing-4)",
    },
    content: {
      background:   "var(--popover)",
      border:       "var(--border)",
      borderWidth:  "1px",
      borderRadius: "var(--radius)",
      shadow:       "var(--shadow-md)",
      padding:      "var(--spacing-1)",
    },
  },
} as const;

// ─── Popover ──────────────────────────────────────────────────────────────────

export const popover = {
  content: {
    background:   "var(--popover)",
    foreground:   "var(--popover-foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-md)",
    paddingX:     "var(--spacing-4)",
    paddingY:     "var(--spacing-3)",
    zIndex:       "50",
    width:        "18rem",
    outline:      "none",
  },
} as const;

// ─── Command / Combobox ───────────────────────────────────────────────────────

export const command = {
  container: {
    background:   "var(--popover)",
    foreground:   "var(--popover-foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-md)",
    overflow:     "hidden" as const,
  },
  input: {
    paddingX:    "var(--spacing-4)",
    paddingY:    "var(--spacing-3)",
    height:      "var(--spacing-11)",
    fontSize:    "var(--text-sm)",
    border:      "none",
    outline:     "none",
    background:  "transparent",
  },
  separator: {
    height:     "1px",
    background: "var(--border)",
  },
  list: {
    maxHeight:   "var(--spacing-80)",
    padding:     "var(--spacing-1)",
    overflow:    "auto" as const,
  },
  empty: {
    paddingX:    "var(--spacing-4)",
    paddingY:    "var(--spacing-6)",
    textAlign:   "center" as const,
    fontSize:    "var(--text-sm)",
    color:       "var(--muted-foreground)",
  },
  group: {
    label: {
      paddingX:    "var(--spacing-2)",
      paddingY:    "var(--spacing-1-5)",
      fontSize:    "var(--text-xs)",
      fontWeight:  "var(--font-medium)",
      color:       "var(--muted-foreground)",
    },
  },
  item: {
    height:       "var(--spacing-8)",
    paddingX:     "var(--spacing-3)",
    borderRadius: "calc(var(--radius) - 4px)",
    fontSize:     "var(--text-sm)",
    cursor:       "default" as const,
    gap:          "var(--spacing-2)",
    focus: {
      background: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    selected: {
      checkColor: "var(--foreground)",
    },
  },
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const overlay = { menu, popover, command } as const;
