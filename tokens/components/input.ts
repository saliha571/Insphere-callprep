/**
 * COMPONENT TOKENS — Input / Textarea / Input-OTP
 */

export const inputBase = {
  background:        "var(--background)",
  foreground:        "var(--foreground)",
  border:            "var(--input)",
  borderWidth:       "1px",
  borderRadius:      "var(--radius)",
  paddingX:          "var(--spacing-3)",     // 12px
  paddingY:          "var(--spacing-2)",     //  8px
  height:            "var(--spacing-9)",     // 36px
  fontSize:          "var(--text-sm)",
  lineHeight:        "var(--leading-normal)",
  shadow:            "var(--shadow-xs)",
  transition:        "border-color 150ms ease, box-shadow 150ms ease",
} as const;

export const inputStates = {
  placeholder: {
    color:   "var(--muted-foreground)",
  },
  focus: {
    border:        "var(--ring)",
    outline:       "none",
    ring:          "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
    ringOffset:    "0px",
  },
  disabled: {
    background:  "var(--muted)",
    foreground:  "var(--muted-foreground)",
    cursor:      "not-allowed",
    opacity:     "0.5",
  },
  error: {
    border:  "var(--destructive)",
    ring:    "0 0 0 2px var(--background), 0 0 0 4px var(--destructive)",
  },
  readonly: {
    background: "var(--muted)",
    cursor:     "default",
  },
} as const;

export const inputSizes = {
  sm: {
    height:    "var(--spacing-7)",   // 28px
    paddingX:  "var(--spacing-2)",
    fontSize:  "var(--text-xs)",
  },
  md: {
    height:    "var(--spacing-9)",   // 36px
    paddingX:  "var(--spacing-3)",
    fontSize:  "var(--text-sm)",
  },
  lg: {
    height:    "var(--spacing-11)",  // 44px
    paddingX:  "var(--spacing-4)",
    fontSize:  "var(--text-base)",
  },
} as const;

export const textarea = {
  ...inputBase,
  height:    "auto",
  minHeight: "var(--spacing-20)",   // 80px
  resize:    "vertical" as const,
} as const;

export const inputOtp = {
  slot: {
    width:        "var(--spacing-10)",
    height:       "var(--spacing-12)",
    border:       "var(--input)",
    borderWidth:  "1px",
    borderRadius: "var(--radius)",
    fontSize:     "var(--text-lg)",
    fontWeight:   "var(--font-medium)",
    caretColor:   "var(--foreground)",
  },
  slotActive: {
    ring: "0 0 0 2px var(--ring)",
  },
  separator: {
    color: "var(--muted-foreground)",
    gap:   "var(--spacing-2)",
  },
} as const;

export const input = { base: inputBase, states: inputStates, sizes: inputSizes, textarea, otp: inputOtp } as const;
export type InputSize = keyof typeof inputSizes;
