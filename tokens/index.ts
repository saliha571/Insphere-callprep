/**
 * INSPHERE DESIGN TOKEN SYSTEM
 * ═══════════════════════════════════════════════
 *
 *  Three-layer architecture
 *  ────────────────────────
 *  1. Primitives  — raw, scale values (palette, spacing, type, radius…)
 *  2. Semantics   — intent-driven roles that map onto primitives
 *  3. Components  — per-component token objects consumed by shadcn/ui
 *
 *  Usage
 *  ─────
 *  import { palette, semanticColors, button } from "@/tokens"
 *  import * as tokens from "@/tokens"
 *
 *  The CSS custom properties in globals.css and the Tailwind config
 *  in tailwind.config.ts must stay in sync with these TypeScript exports.
 */

// ── Layer 1: Primitives ──────────────────────────────────────────────────────
export {
  palette,
  zinc, slate, gray, neutral, stone,
  red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky,
  blue, indigo, violet, purple, fuchsia, pink, rose,
  white, black, transparent,
} from "./primitives/colors";

export { spacing }                                           from "./primitives/spacing";
export { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from "./primitives/typography";
export { radii }                                             from "./primitives/radii";
export { shadows }                                           from "./primitives/shadows";
export { opacity }                                           from "./primitives/opacity";
export { zIndex }                                            from "./primitives/z-index";

// ── Layer 2: Semantics ───────────────────────────────────────────────────────
export { semanticColors }                                    from "./semantics/colors";
export type { SemanticColorToken, SemanticColors }           from "./semantics/colors";

export { semanticTypography }                                from "./semantics/typography";
export type { SemanticTypography, TypographyRole }           from "./semantics/typography";

export { semanticSpacing }                                   from "./semantics/spacing";
export type { SemanticSpacing }                              from "./semantics/spacing";

export { semanticEffects }                                   from "./semantics/effects";
export type { SemanticEffects }                              from "./semantics/effects";

// ── Layer 3: Components ──────────────────────────────────────────────────────
export { button }                                            from "./components/button";
export type { ButtonVariant, ButtonSize }                    from "./components/button";

export { input }                                             from "./components/input";
export type { InputSize }                                    from "./components/input";

export { card }                                              from "./components/card";
export { badge }                                             from "./components/badge";
export type { BadgeVariant }                                 from "./components/badge";

export { alert }                                             from "./components/alert";
export type { AlertVariant }                                 from "./components/alert";

export { dialog }                                            from "./components/dialog";
export type { SheetSide }                                    from "./components/dialog";

export { navigation }                                        from "./components/navigation";
export { form }                                              from "./components/form";
export { feedback }                                          from "./components/feedback";
export { overlay }                                           from "./components/overlay";
export { dataDisplay }                                       from "./components/data-display";
