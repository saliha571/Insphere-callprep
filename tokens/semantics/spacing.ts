/**
 * SEMANTIC SPACING TOKENS
 *
 * Named layout distances for common UI patterns.
 * Values reference primitive spacing steps so the scale
 * stays consistent if the base unit ever changes.
 */

import { spacing } from "../primitives/spacing";

// ─── Inset (padding inside a container) ──────────────────────────────────────

export const inset = {
  none:   spacing[0],
  xs:     spacing[2],    //  8px — icon buttons, tight chips
  sm:     spacing[3],    // 12px — compact forms, small badges
  md:     spacing[4],    // 16px — default form inputs, cards
  lg:     spacing[6],    // 24px — panels, section padding
  xl:     spacing[8],    // 32px — page content padding
  "2xl":  spacing[12],   // 48px — hero sections
} as const;

// ─── Stack (vertical gap between elements) ────────────────────────────────────

export const stack = {
  none:   spacing[0],
  "3xs":  spacing[1],    //  4px — tight label groups
  "2xs":  spacing[2],    //  8px — inline sub-labels
  xs:     spacing[3],    // 12px — form field groups
  sm:     spacing[4],    // 16px — list items
  md:     spacing[6],    // 24px — section gaps
  lg:     spacing[8],    // 32px — major section breaks
  xl:     spacing[12],   // 48px — page-level section gaps
  "2xl":  spacing[16],   // 64px — hero / large blocks
} as const;

// ─── Inline (horizontal gap between sibling elements) ────────────────────────

export const inline = {
  none:  spacing[0],
  "3xs": spacing[0.5],   //  2px — icon-to-text gap
  "2xs": spacing[1],     //  4px — tight inline pairs
  xs:    spacing[2],     //  8px — button icon + label
  sm:    spacing[3],     // 12px — chip / tag gap
  md:    spacing[4],     // 16px — form label + input
  lg:    spacing[6],     // 24px — nav items
  xl:    spacing[8],     // 32px — toolbar items
} as const;

// ─── Layout (structural containers / regions) ────────────────────────────────

export const layout = {
  gutter:       spacing[4],    // 16px — mobile page gutter
  gutterMd:     spacing[6],    // 24px — tablet page gutter
  gutterLg:     spacing[8],    // 32px — desktop page gutter
  containerSm:  "640px",
  containerMd:  "768px",
  containerLg:  "1024px",
  containerXl:  "1280px",
  container2xl: "1536px",
  sidebarWidth: spacing[64],   // 256px — default sidebar
  headerHeight: spacing[14],   //  56px — top app bar
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const semanticSpacing = {
  inset,
  stack,
  inline,
  layout,
} as const;

export type SemanticSpacing = typeof semanticSpacing;
