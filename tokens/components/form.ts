/**
 * COMPONENT TOKENS — Form elements: Checkbox, Radio, Switch, Slider, Select, Label
 */

// ─── Label ────────────────────────────────────────────────────────────────────

export const label = {
  fontSize:    "var(--text-sm)",
  fontWeight:  "var(--font-medium)",
  lineHeight:  "var(--leading-none)",
  color:       "var(--foreground)",
  cursor:      "default" as const,
  disabled: {
    opacity: "0.5",
    cursor:  "not-allowed",
  },
} as const;

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export const checkbox = {
  size:          "var(--spacing-4)",    // 16px
  borderRadius:  "var(--radius-sm)",
  border:        "var(--primary)",
  borderWidth:   "1px",
  shadow:        "var(--shadow-xs)",
  checked: {
    background:   "var(--primary)",
    border:       "var(--primary)",
    iconColor:    "var(--primary-foreground)",
  },
  unchecked: {
    background:   "var(--background)",
  },
  focus: {
    ring:         "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
  },
  disabled: {
    opacity:      "0.5",
    cursor:       "not-allowed",
  },
} as const;

// ─── Radio Group ─────────────────────────────────────────────────────────────

export const radioGroup = {
  gap:     "var(--spacing-2)",
  item: {
    size:         "var(--spacing-4)",
    borderRadius: "9999px",
    border:       "var(--primary)",
    borderWidth:  "1px",
    shadow:       "var(--shadow-xs)",
    checked: {
      background:   "var(--primary)",
      indicator:    "var(--primary-foreground)",
      indicatorSize:"var(--spacing-2)",
    },
    focus: {
      ring: "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
  },
} as const;

// ─── Switch ───────────────────────────────────────────────────────────────────

export const switchToken = {
  track: {
    width:         "var(--spacing-11)",   // 44px
    height:        "var(--spacing-6)",    // 24px
    borderRadius:  "9999px",
    border:        "2px solid transparent",
    transition:    "background-color 150ms ease",
    unchecked: {
      background: "var(--input)",
    },
    checked: {
      background: "var(--primary)",
    },
  },
  thumb: {
    size:           "var(--spacing-5)",   // 20px
    borderRadius:   "9999px",
    background:     "var(--background)",
    shadow:         "var(--shadow-sm)",
    transition:     "transform 150ms ease",
    checked: {
      transform: "translateX(var(--spacing-5))",
    },
  },
  focus: {
    ring: "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
  },
  disabled: {
    opacity: "0.5",
    cursor:  "not-allowed",
  },
} as const;

// ─── Slider ───────────────────────────────────────────────────────────────────

export const slider = {
  track: {
    height:       "var(--spacing-1-5)",   //  6px
    borderRadius: "9999px",
    background:   "var(--secondary)",
    overflow:     "hidden" as const,
  },
  range: {
    background:   "var(--primary)",
    height:       "100%",
  },
  thumb: {
    size:         "var(--spacing-4)",     // 16px
    borderRadius: "9999px",
    border:       "2px solid var(--primary)",
    background:   "var(--background)",
    shadow:       "var(--shadow-sm)",
    focus: {
      ring:         "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
      ringOffset:   "0px",
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
  },
} as const;

// ─── Select ───────────────────────────────────────────────────────────────────

export const select = {
  trigger: {
    height:       "var(--spacing-9)",
    paddingX:     "var(--spacing-3)",
    paddingY:     "var(--spacing-2)",
    borderRadius: "var(--radius)",
    border:       "var(--input)",
    borderWidth:  "1px",
    background:   "var(--background)",
    foreground:   "var(--foreground)",
    shadow:       "var(--shadow-xs)",
    fontSize:     "var(--text-sm)",
    gap:          "var(--spacing-2)",
    focus: {
      ring: "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
  },
  content: {
    background:   "var(--popover)",
    foreground:   "var(--popover-foreground)",
    border:       "var(--border)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    shadow:       "var(--shadow-md)",
    zIndex:       "50",
    padding:      "var(--spacing-1)",
    maxHeight:    "var(--spacing-80)",
  },
  item: {
    height:       "var(--spacing-8)",
    paddingX:     "var(--spacing-8)",  // space for check icon
    paddingY:     "var(--spacing-1-5)",
    borderRadius: "calc(var(--radius) - 2px)",
    fontSize:     "var(--text-sm)",
    focus: {
      background: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    disabled: {
      opacity: "0.5",
      cursor:  "not-allowed",
    },
  },
  separator: {
    height:     "1px",
    background: "var(--border)",
    marginX:    "calc(var(--spacing-1) * -1)",
    marginY:    "var(--spacing-1)",
  },
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const form = {
  label,
  checkbox,
  radioGroup,
  switch: switchToken,
  slider,
  select,
} as const;

export type FormComponent = keyof typeof form;
