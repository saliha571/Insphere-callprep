/**
 * PRIMITIVE BORDER RADIUS TOKENS
 *
 * Geometric radius scale. The `md` step (0.375rem / 6px) is shadcn's
 * `--radius` base variable. All component radii are derived relative
 * to this base value in the semantic layer.
 */

export const radii = {
  none:  "0px",
  xs:    "0.125rem",  //  2px
  sm:    "0.25rem",   //  4px
  md:    "0.375rem",  //  6px  ← shadcn --radius base
  lg:    "0.5rem",    //  8px
  xl:    "0.75rem",   // 12px
  "2xl": "1rem",      // 16px
  "3xl": "1.5rem",    // 24px
  "4xl": "2rem",      // 32px
  full:  "9999px",    // pill / circle
} as const;

export type RadiiKey   = keyof typeof radii;
export type RadiiValue = typeof radii[RadiiKey];
