/**
 * SEMANTIC EFFECT TOKENS
 *
 * Named shadows, border widths, and focus ring styles
 * that carry design intent (elevation, interaction state).
 */

import { shadows } from "../primitives/shadows";
import { radii }   from "../primitives/radii";

// ─── Elevation (box-shadow layers) ───────────────────────────────────────────

export const elevation = {
  flat:    shadows.none,   // Cards resting on same surface plane
  raised:  shadows.sm,     // Cards / panels lifted off background
  overlay: shadows.md,     // Dropdowns, popovers, floating elements
  modal:   shadows.xl,     // Dialogs, drawers
  sticky:  shadows.lg,     // Sticky headers after scroll
} as const;

// ─── Focus Rings ──────────────────────────────────────────────────────────────

export const focus = {
  ring:         "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
  ringDestructive: "0 0 0 2px var(--background), 0 0 0 4px var(--destructive)",
  ringSuccess:     "0 0 0 2px var(--background), 0 0 0 4px var(--success)",
  ringOffset:   "2px",
  ringWidth:    "2px",
} as const;

// ─── Border ───────────────────────────────────────────────────────────────────

export const borderWidth = {
  none:    "0px",
  hairline:"0.5px",
  thin:    "1px",
  base:    "1.5px",
  thick:   "2px",
  heavy:   "4px",
} as const;

// ─── Semantic Radii (references primitive radii) ──────────────────────────────

export const semanticRadii = {
  none:      radii.none,
  sm:        radii.sm,     // Subtle rounding — badges, chips
  base:      radii.md,     // Default — inputs, buttons  ← matches --radius
  card:      radii.lg,     // Card corners
  dialog:    radii.xl,     // Modal / dialog corners
  popover:   radii.lg,     // Popover corners
  full:      radii.full,   // Pills, circular avatars
} as const;

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transition = {
  durationFast:   "150ms",
  durationBase:   "200ms",
  durationSlow:   "300ms",
  durationSlower: "500ms",
  easingDefault:  "cubic-bezier(0.4, 0, 0.2, 1)",
  easingIn:       "cubic-bezier(0.4, 0, 1, 1)",
  easingOut:      "cubic-bezier(0, 0, 0.2, 1)",
  easingSpring:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const semanticEffects = {
  elevation,
  focus,
  borderWidth,
  semanticRadii,
  transition,
} as const;

export type SemanticEffects = typeof semanticEffects;
