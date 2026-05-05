/**
 * PRIMITIVE TYPOGRAPHY TOKENS
 *
 * Raw type-scale values for font families, sizes, weights,
 * line heights, and letter spacing.
 */

// ─── Font Families ────────────────────────────────────────────────────────────
export const fontFamily = {
  sans:  ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
  serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
  mono:  ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
} as const;

// ─── Font Sizes (with paired line heights) ────────────────────────────────────
export const fontSize = {
  "2xs":  ["0.625rem",  { lineHeight: "0.875rem"  }],  // 10px / 14px
  xs:     ["0.75rem",   { lineHeight: "1rem"       }],  // 12px / 16px
  sm:     ["0.875rem",  { lineHeight: "1.25rem"    }],  // 14px / 20px
  base:   ["1rem",      { lineHeight: "1.5rem"     }],  // 16px / 24px
  lg:     ["1.125rem",  { lineHeight: "1.75rem"    }],  // 18px / 28px
  xl:     ["1.25rem",   { lineHeight: "1.75rem"    }],  // 20px / 28px
  "2xl":  ["1.5rem",    { lineHeight: "2rem"       }],  // 24px / 32px
  "3xl":  ["1.875rem",  { lineHeight: "2.25rem"    }],  // 30px / 36px
  "4xl":  ["2.25rem",   { lineHeight: "2.5rem"     }],  // 36px / 40px
  "5xl":  ["3rem",      { lineHeight: "1"          }],  // 48px
  "6xl":  ["3.75rem",   { lineHeight: "1"          }],  // 60px
  "7xl":  ["4.5rem",    { lineHeight: "1"          }],  // 72px
  "8xl":  ["6rem",      { lineHeight: "1"          }],  // 96px
  "9xl":  ["8rem",      { lineHeight: "1"          }],  // 128px
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────
export const fontWeight = {
  thin:       "100",
  extralight: "200",
  light:      "300",
  normal:     "400",
  medium:     "500",
  semibold:   "600",
  bold:       "700",
  extrabold:  "800",
  black:      "900",
} as const;

// ─── Line Heights ─────────────────────────────────────────────────────────────
export const lineHeight = {
  none:    "1",
  tight:   "1.25",
  snug:    "1.375",
  normal:  "1.5",
  relaxed: "1.625",
  loose:   "2",
  3:  ".75rem",
  4:  "1rem",
  5:  "1.25rem",
  6:  "1.5rem",
  7:  "1.75rem",
  8:  "2rem",
  9:  "2.25rem",
  10: "2.5rem",
} as const;

// ─── Letter Spacing ───────────────────────────────────────────────────────────
export const letterSpacing = {
  tighter: "-0.05em",
  tight:   "-0.025em",
  normal:  "0em",
  wide:    "0.025em",
  wider:   "0.05em",
  widest:  "0.1em",
} as const;

export type FontFamily   = typeof fontFamily;
export type FontSizeKey  = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
