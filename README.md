# Insphere Design Token System

A three-layer design token architecture built on **shadcn/ui** + **Tailwind CSS**, structured for scalability, theming, and dark-mode support out of the box.

---

## Token Architecture

```
tokens/
├── primitives/          Layer 1 — raw values, no semantic meaning
│   ├── colors.ts        Full color palette (zinc, slate, red, blue, …)
│   ├── spacing.ts       4px-base spacing scale (0 → 96)
│   ├── typography.ts    Font families, sizes, weights, line heights
│   ├── radii.ts         Border radius scale (none → full)
│   ├── shadows.ts       Box shadow scale (xs → 2xl + inner)
│   ├── opacity.ts       Opacity scale
│   ├── z-index.ts       Z-index layering stack
│   └── index.ts
│
├── semantics/           Layer 2 — intent-driven roles mapped from primitives
│   ├── colors.ts        Light + dark semantic colors (background, primary, …)
│   ├── typography.ts    Named text styles (h1–h4, body, label, caption, code)
│   ├── spacing.ts       Inset, stack, inline, layout tokens
│   ├── effects.ts       Elevation, focus rings, border widths, transitions
│   └── index.ts
│
└── components/          Layer 3 — per-component token objects
    ├── button.ts        Variants (default/destructive/outline/…) + sizes
    ├── input.ts         Base, states, sizes, textarea, OTP
    ├── card.ts          Surface, header, content, footer, variants
    ├── badge.ts         Variants (default/success/warning/info/…)
    ├── alert.ts         Variants + title + description tokens
    ├── dialog.ts        Overlay, content, header, footer, sheet sides
    ├── navigation.ts    Tabs, sidebar, breadcrumb, pagination
    ├── form.ts          Label, checkbox, radio, switch, slider, select
    ├── feedback.ts      Toast, progress, skeleton, spinner, tooltip
    ├── overlay.ts       Dropdown menu, popover, command palette
    ├── data-display.ts  Table, avatar, accordion, separator, scroll-area
    └── index.ts
```

---

## CSS Custom Properties

All semantic tokens are expressed as CSS custom properties in `app/globals.css`. They follow [shadcn/ui v4 conventions](https://ui.shadcn.com/docs/theming) using `oklch()` color values.

| Property              | Light                      | Dark                       |
|-----------------------|----------------------------|----------------------------|
| `--background`        | `oklch(1 0 0)`             | `oklch(0.145 0 0)`         |
| `--foreground`        | `oklch(0.145 0 0)`         | `oklch(0.985 0 0)`         |
| `--primary`           | `oklch(0.205 0 0)`         | `oklch(0.922 0 0)`         |
| `--destructive`       | `oklch(0.577 0.245 27.3)`  | `oklch(0.704 0.191 22.2)`  |
| `--success`           | `oklch(0.527 0.154 150.1)` | `oklch(0.696 0.17 162.5)`  |
| `--warning`           | `oklch(0.769 0.188 70.1)`  | `oklch(0.828 0.189 84.4)`  |
| `--info`              | `oklch(0.546 0.216 262.9)` | `oklch(0.707 0.165 254.6)` |
| `--border`            | `oklch(0.922 0 0)`         | `oklch(1 0 0 / 10%)`       |
| `--radius`            | `0.625rem`                 | `0.625rem`                 |

Switch modes by toggling the `.dark` class on `<html>`.

---

## Tailwind Integration

`tailwind.config.ts` maps every semantic token to a Tailwind utility:

```tsx
// These all resolve to CSS vars — dark mode automatic
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground rounded-md" />
<span className="text-muted-foreground" />
<div className="border border-border shadow-sm" />
```

---

## Usage

### Install dependencies
```bash
npm install
```

### Add a shadcn component
```bash
npx shadcn@latest add button
npx shadcn@latest add card dialog select
```

### Import tokens in TypeScript
```ts
import { palette, semanticColors, button, card } from "@/tokens"

// Primitive: raw hex
console.log(palette.zinc[500]) // "#71717a"

// Semantic: CSS var reference + light/dark values
console.log(semanticColors.primary.cssVar)   // "primary"
console.log(semanticColors.primary.light)    // "oklch(0.205 0 0)"

// Component: token object for a variant
console.log(button.variants.destructive.background) // "var(--destructive)"
```

### Use the `cn()` utility
```ts
import { cn } from "@/lib/utils"

cn("px-4 py-2 rounded-md", isActive && "bg-primary text-primary-foreground")
```

---

## Customizing the Theme

1. **Change the base color** — swap the `oklch()` values in `:root` inside `globals.css`
2. **Change the radius** — update `--radius` in `:root` (all component radii are calc-relative)
3. **Add a new semantic token** — add to `tokens/semantics/colors.ts`, add CSS var to `globals.css`, extend `tailwind.config.ts`
4. **Override a component token** — extend the relevant file in `tokens/components/`

---

## Stack

| Tool | Purpose |
|------|---------|
| shadcn/ui | Accessible, composable component primitives |
| Tailwind CSS | Utility-first styling with semantic color tokens |
| Radix UI | Headless accessible UI primitives |
| class-variance-authority | Type-safe variant styling |
| tailwind-merge + clsx | Safe class composition via `cn()` |
| tw-animate-css | Animation utilities for shadcn transitions |
