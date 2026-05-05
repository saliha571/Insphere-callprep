/**
 * SEMANTIC COLOR TOKENS
 *
 * Maps primitive palette values to named design roles.
 * Every token here resolves to a CSS custom property so
 * Tailwind utilities (bg-background, text-foreground, …)
 * automatically support light and dark modes via the
 * .dark class on <html>.
 *
 * Format:  { cssVar, light, dark }
 *   cssVar  → the CSS custom property name (without --)
 *   light   → value used in light mode (oklch, matching shadcn v4)
 *   dark    → value used in dark mode
 */

export interface SemanticColorToken {
  cssVar: string;
  light: string;
  dark: string;
  description?: string;
}

// ─── Surface ─────────────────────────────────────────────────────────────────

export const background: SemanticColorToken = {
  cssVar: "background",
  light: "oklch(1 0 0)",           // white
  dark:  "oklch(0.145 0 0)",       // zinc-950
  description: "Page / app canvas background",
};

export const foreground: SemanticColorToken = {
  cssVar: "foreground",
  light: "oklch(0.145 0 0)",       // zinc-950
  dark:  "oklch(0.985 0 0)",       // near-white
  description: "Default body text color",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export const card: SemanticColorToken = {
  cssVar: "card",
  light: "oklch(1 0 0)",
  dark:  "oklch(0.205 0 0)",
  description: "Card / surface elevation background",
};

export const cardForeground: SemanticColorToken = {
  cssVar: "card-foreground",
  light: "oklch(0.145 0 0)",
  dark:  "oklch(0.985 0 0)",
  description: "Text on card surfaces",
};

// ─── Popover ──────────────────────────────────────────────────────────────────

export const popover: SemanticColorToken = {
  cssVar: "popover",
  light: "oklch(1 0 0)",
  dark:  "oklch(0.205 0 0)",
  description: "Popover / dropdown background",
};

export const popoverForeground: SemanticColorToken = {
  cssVar: "popover-foreground",
  light: "oklch(0.145 0 0)",
  dark:  "oklch(0.985 0 0)",
  description: "Text on popovers",
};

// ─── Primary ─────────────────────────────────────────────────────────────────

export const primary: SemanticColorToken = {
  cssVar: "primary",
  light: "oklch(0.205 0 0)",       // zinc-900
  dark:  "oklch(0.922 0 0)",       // zinc-200
  description: "Primary action / brand color",
};

export const primaryForeground: SemanticColorToken = {
  cssVar: "primary-foreground",
  light: "oklch(0.985 0 0)",
  dark:  "oklch(0.205 0 0)",
  description: "Text / icons on primary backgrounds",
};

// ─── Secondary ───────────────────────────────────────────────────────────────

export const secondary: SemanticColorToken = {
  cssVar: "secondary",
  light: "oklch(0.97 0 0)",        // zinc-100
  dark:  "oklch(0.269 0 0)",       // zinc-800
  description: "Secondary / supporting action color",
};

export const secondaryForeground: SemanticColorToken = {
  cssVar: "secondary-foreground",
  light: "oklch(0.205 0 0)",
  dark:  "oklch(0.985 0 0)",
  description: "Text on secondary backgrounds",
};

// ─── Muted ────────────────────────────────────────────────────────────────────

export const muted: SemanticColorToken = {
  cssVar: "muted",
  light: "oklch(0.97 0 0)",        // zinc-100
  dark:  "oklch(0.269 0 0)",
  description: "Muted / subtle background (disabled states, code blocks)",
};

export const mutedForeground: SemanticColorToken = {
  cssVar: "muted-foreground",
  light: "oklch(0.556 0 0)",       // zinc-500
  dark:  "oklch(0.708 0 0)",       // zinc-400
  description: "Placeholder, captions, helper text",
};

// ─── Accent ───────────────────────────────────────────────────────────────────

export const accent: SemanticColorToken = {
  cssVar: "accent",
  light: "oklch(0.97 0 0)",
  dark:  "oklch(0.269 0 0)",
  description: "Hover / active highlight on transparent backgrounds",
};

export const accentForeground: SemanticColorToken = {
  cssVar: "accent-foreground",
  light: "oklch(0.205 0 0)",
  dark:  "oklch(0.985 0 0)",
  description: "Text on accent backgrounds",
};

// ─── Destructive ──────────────────────────────────────────────────────────────

export const destructive: SemanticColorToken = {
  cssVar: "destructive",
  light: "oklch(0.577 0.245 27.325)",  // red-500 equivalent
  dark:  "oklch(0.704 0.191 22.216)",  // red-400 equivalent
  description: "Error / danger / delete action color",
};

export const destructiveForeground: SemanticColorToken = {
  cssVar: "destructive-foreground",
  light: "oklch(0.985 0 0)",
  dark:  "oklch(0.145 0 0)",
  description: "Text on destructive backgrounds",
};

// ─── Status ───────────────────────────────────────────────────────────────────

export const success: SemanticColorToken = {
  cssVar: "success",
  light: "oklch(0.527 0.154 150.069)",  // green-600
  dark:  "oklch(0.696 0.17  162.48)",   // green-400
  description: "Success / positive confirmation color",
};

export const successForeground: SemanticColorToken = {
  cssVar: "success-foreground",
  light: "oklch(0.985 0 0)",
  dark:  "oklch(0.145 0 0)",
};

export const warning: SemanticColorToken = {
  cssVar: "warning",
  light: "oklch(0.769 0.188 70.08)",   // amber-400
  dark:  "oklch(0.828 0.189 84.429)",  // amber-300
  description: "Warning / caution color",
};

export const warningForeground: SemanticColorToken = {
  cssVar: "warning-foreground",
  light: "oklch(0.145 0 0)",
  dark:  "oklch(0.145 0 0)",
};

export const info: SemanticColorToken = {
  cssVar: "info",
  light: "oklch(0.546 0.216 262.881)",  // blue-500
  dark:  "oklch(0.707 0.165 254.624)",  // blue-400
  description: "Informational / neutral-status color",
};

export const infoForeground: SemanticColorToken = {
  cssVar: "info-foreground",
  light: "oklch(0.985 0 0)",
  dark:  "oklch(0.145 0 0)",
};

// ─── Border / Ring / Input ────────────────────────────────────────────────────

export const border: SemanticColorToken = {
  cssVar: "border",
  light: "oklch(0.922 0 0)",       // zinc-200
  dark:  "oklch(1 0 0 / 10%)",
  description: "Default border / divider color",
};

export const input: SemanticColorToken = {
  cssVar: "input",
  light: "oklch(0.922 0 0)",
  dark:  "oklch(1 0 0 / 15%)",
  description: "Form input border color",
};

export const ring: SemanticColorToken = {
  cssVar: "ring",
  light: "oklch(0.708 0 0)",       // zinc-400
  dark:  "oklch(0.556 0 0)",       // zinc-500
  description: "Focus ring / outline color",
};

// ─── Chart ────────────────────────────────────────────────────────────────────

export const chart = {
  1: { cssVar: "chart-1", light: "oklch(0.646 0.222 41.116)",  dark: "oklch(0.488 0.243 264.376)" },
  2: { cssVar: "chart-2", light: "oklch(0.6   0.118 184.704)", dark: "oklch(0.696 0.17  162.48)" },
  3: { cssVar: "chart-3", light: "oklch(0.398 0.07  227.392)", dark: "oklch(0.769 0.188 70.08)" },
  4: { cssVar: "chart-4", light: "oklch(0.828 0.189 84.429)",  dark: "oklch(0.627 0.265 303.9)" },
  5: { cssVar: "chart-5", light: "oklch(0.769 0.188 70.08)",   dark: "oklch(0.645 0.246 16.439)" },
} as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const sidebar = {
  background:         { cssVar: "sidebar",                    light: "oklch(0.985 0 0)",  dark: "oklch(0.205 0 0)" },
  foreground:         { cssVar: "sidebar-foreground",         light: "oklch(0.145 0 0)",  dark: "oklch(0.985 0 0)" },
  primary:            { cssVar: "sidebar-primary",            light: "oklch(0.205 0 0)",  dark: "oklch(0.488 0.243 264.376)" },
  primaryForeground:  { cssVar: "sidebar-primary-foreground", light: "oklch(0.985 0 0)",  dark: "oklch(0.985 0 0)" },
  accent:             { cssVar: "sidebar-accent",             light: "oklch(0.97 0 0)",   dark: "oklch(0.269 0 0)" },
  accentForeground:   { cssVar: "sidebar-accent-foreground",  light: "oklch(0.205 0 0)",  dark: "oklch(0.985 0 0)" },
  border:             { cssVar: "sidebar-border",             light: "oklch(0.922 0 0)",  dark: "oklch(1 0 0 / 10%)" },
  ring:               { cssVar: "sidebar-ring",               light: "oklch(0.708 0 0)",  dark: "oklch(0.556 0 0)" },
} as const;

// ─── Aggregated export ────────────────────────────────────────────────────────

export const semanticColors = {
  background,
  foreground,
  card,
  cardForeground,
  popover,
  popoverForeground,
  primary,
  primaryForeground,
  secondary,
  secondaryForeground,
  muted,
  mutedForeground,
  accent,
  accentForeground,
  destructive,
  destructiveForeground,
  success,
  successForeground,
  warning,
  warningForeground,
  info,
  infoForeground,
  border,
  input,
  ring,
  chart,
  sidebar,
} as const;

export type SemanticColors = typeof semanticColors;
