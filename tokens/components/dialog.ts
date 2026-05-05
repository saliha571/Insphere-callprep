/**
 * COMPONENT TOKENS — Dialog / Sheet / Drawer
 */

export const dialogOverlay = {
  background:   "oklch(0 0 0 / 80%)",
  backdropFilter: "blur(0px)",
  zIndex:       "40",
  inset:        "0",
  position:     "fixed" as const,
} as const;

export const dialogContent = {
  background:   "var(--background)",
  foreground:   "var(--foreground)",
  border:       "var(--border)",
  borderWidth:  "1px",
  borderRadius: "calc(var(--radius) * 2)",
  shadow:       "var(--shadow-xl)",
  zIndex:       "50",
  maxWidth:     "32rem",    // sm: 512px
  width:        "100%",
  paddingX:     "var(--spacing-6)",
  paddingY:     "var(--spacing-6)",
  gap:          "var(--spacing-4)",
} as const;

export const dialogHeader = {
  display:     "flex",
  flexDir:     "column" as const,
  gap:         "var(--spacing-1-5)",
  paddingBottom: "var(--spacing-0)",
} as const;

export const dialogTitle = {
  fontSize:    "var(--text-lg)",
  fontWeight:  "var(--font-semibold)",
  lineHeight:  "var(--leading-tight)",
  letterSpacing: "-0.025em",
} as const;

export const dialogDescription = {
  fontSize:    "var(--text-sm)",
  color:       "var(--muted-foreground)",
  lineHeight:  "var(--leading-normal)",
} as const;

export const dialogFooter = {
  display:     "flex",
  flexDir:     "column-reverse" as const,
  gap:         "var(--spacing-2)",
  paddingTop:  "var(--spacing-4)",
} as const;

// ─── Sheet (slide-in drawer) ──────────────────────────────────────────────────

export const sheetSides = {
  left: {
    insetY:        "0",
    left:          "0",
    width:         "75%",
    maxWidth:      "24rem",
    borderRight:   "1px solid var(--border)",
    borderRadius:  "0 var(--radius) var(--radius) 0",
  },
  right: {
    insetY:        "0",
    right:         "0",
    width:         "75%",
    maxWidth:      "24rem",
    borderLeft:    "1px solid var(--border)",
    borderRadius:  "var(--radius) 0 0 var(--radius)",
  },
  top: {
    insetX:        "0",
    top:           "0",
    height:        "auto",
    maxHeight:     "96%",
    borderBottom:  "1px solid var(--border)",
    borderRadius:  "0 0 var(--radius) var(--radius)",
  },
  bottom: {
    insetX:        "0",
    bottom:        "0",
    height:        "auto",
    maxHeight:     "96%",
    borderTop:     "1px solid var(--border)",
    borderRadius:  "var(--radius) var(--radius) 0 0",
  },
} as const;

export const dialog = {
  overlay:     dialogOverlay,
  content:     dialogContent,
  header:      dialogHeader,
  title:       dialogTitle,
  description: dialogDescription,
  footer:      dialogFooter,
  sheet:       { sides: sheetSides },
} as const;

export type SheetSide = keyof typeof sheetSides;
