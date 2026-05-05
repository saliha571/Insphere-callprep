/**
 * PRIMITIVE Z-INDEX TOKENS
 *
 * Layering stack for stacking context management.
 */

export const zIndex = {
  auto:     "auto",
  0:        "0",
  10:       "10",   // dropdowns, floating labels
  20:       "20",   // sticky headers
  30:       "30",   // drawers, side-sheets
  40:       "40",   // modals / dialogs
  50:       "50",   // toasts / notifications
  overlay:  "100",  // full-screen overlays
  tooltip:  "200",  // tooltips (always on top)
} as const;

export type ZIndexKey = keyof typeof zIndex;
