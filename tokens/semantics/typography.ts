/**
 * SEMANTIC TYPOGRAPHY TOKENS
 *
 * Named text styles mapped from the primitive scale.
 * Each role describes intent (heading, body, label…) rather
 * than raw values, making it easy to swap the underlying
 * scale without touching component code.
 */

import { fontSize, fontWeight, lineHeight, letterSpacing, fontFamily } from "../primitives/typography";

// ─── Display / Hero ───────────────────────────────────────────────────────────

export const displayLarge = {
  fontSize:      fontSize["5xl"][0],
  fontWeight:    fontWeight.bold,
  lineHeight:    lineHeight.none,
  letterSpacing: letterSpacing.tighter,
  fontFamily:    fontFamily.sans,
} as const;

export const displayMedium = {
  fontSize:      fontSize["4xl"][0],
  fontWeight:    fontWeight.bold,
  lineHeight:    lineHeight.none,
  letterSpacing: letterSpacing.tighter,
  fontFamily:    fontFamily.sans,
} as const;

export const displaySmall = {
  fontSize:      fontSize["3xl"][0],
  fontWeight:    fontWeight.semibold,
  lineHeight:    lineHeight.tight,
  letterSpacing: letterSpacing.tight,
  fontFamily:    fontFamily.sans,
} as const;

// ─── Headings ─────────────────────────────────────────────────────────────────

export const h1 = {
  fontSize:      fontSize["2xl"][0],
  fontWeight:    fontWeight.bold,
  lineHeight:    lineHeight.tight,
  letterSpacing: letterSpacing.tight,
  fontFamily:    fontFamily.sans,
} as const;

export const h2 = {
  fontSize:      fontSize.xl[0],
  fontWeight:    fontWeight.semibold,
  lineHeight:    lineHeight.snug,
  letterSpacing: letterSpacing.tight,
  fontFamily:    fontFamily.sans,
} as const;

export const h3 = {
  fontSize:      fontSize.lg[0],
  fontWeight:    fontWeight.semibold,
  lineHeight:    lineHeight.snug,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

export const h4 = {
  fontSize:      fontSize.base[0],
  fontWeight:    fontWeight.semibold,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

// ─── Body ─────────────────────────────────────────────────────────────────────

export const bodyLarge = {
  fontSize:      fontSize.lg[0],
  fontWeight:    fontWeight.normal,
  lineHeight:    lineHeight.relaxed,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

export const bodyBase = {
  fontSize:      fontSize.base[0],
  fontWeight:    fontWeight.normal,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

export const bodySmall = {
  fontSize:      fontSize.sm[0],
  fontWeight:    fontWeight.normal,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

// ─── Label ────────────────────────────────────────────────────────────────────

export const labelLarge = {
  fontSize:      fontSize.sm[0],
  fontWeight:    fontWeight.medium,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.wide,
  fontFamily:    fontFamily.sans,
} as const;

export const labelBase = {
  fontSize:      fontSize.xs[0],
  fontWeight:    fontWeight.medium,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.wide,
  fontFamily:    fontFamily.sans,
} as const;

export const labelSmall = {
  fontSize:      fontSize["2xs"][0],
  fontWeight:    fontWeight.medium,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.wider,
  fontFamily:    fontFamily.sans,
} as const;

// ─── Caption / Helper ─────────────────────────────────────────────────────────

export const caption = {
  fontSize:      fontSize.xs[0],
  fontWeight:    fontWeight.normal,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.sans,
} as const;

// ─── Code ─────────────────────────────────────────────────────────────────────

export const codeBlock = {
  fontSize:      fontSize.sm[0],
  fontWeight:    fontWeight.normal,
  lineHeight:    lineHeight.relaxed,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.mono,
} as const;

export const codeInline = {
  fontSize:      fontSize.sm[0],
  fontWeight:    fontWeight.medium,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.normal,
  fontFamily:    fontFamily.mono,
} as const;

// ─── Overline ─────────────────────────────────────────────────────────────────

export const overline = {
  fontSize:      fontSize.xs[0],
  fontWeight:    fontWeight.semibold,
  lineHeight:    lineHeight.normal,
  letterSpacing: letterSpacing.widest,
  fontFamily:    fontFamily.sans,
  textTransform: "uppercase" as const,
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const semanticTypography = {
  displayLarge,
  displayMedium,
  displaySmall,
  h1, h2, h3, h4,
  bodyLarge,
  bodyBase,
  bodySmall,
  labelLarge,
  labelBase,
  labelSmall,
  caption,
  codeBlock,
  codeInline,
  overline,
} as const;

export type SemanticTypography = typeof semanticTypography;
export type TypographyRole = keyof SemanticTypography;
