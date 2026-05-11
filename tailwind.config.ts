import type { Config } from "tailwindcss";

/**
 * TAILWIND CONFIG
 *
 * Wires the three-layer token system into Tailwind utility classes:
 *   • Primitive tokens  → raw scale extensions (colors, spacing, etc.)
 *   • Semantic tokens   → CSS-var-backed theme colors & radii
 *   • Component tokens  → referenced directly in component TSX via cn()
 *
 * Color utilities automatically support dark mode via the .dark class.
 * Add `darkMode: "class"` to <html> to activate.
 */

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./tokens/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  theme: {
    // ── Container ────────────────────────────────────────────────────────────
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm:      "1.5rem",
        lg:      "2rem",
        xl:      "2.5rem",
        "2xl":   "3rem",
      },
    },

    extend: {
      // ── Semantic Color Tokens ─────────────────────────────────────────────
      // Each maps to a CSS custom property so light/dark just works.
      colors: {
        background:  "var(--background)",
        foreground:  "var(--foreground)",

        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT:    "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT:    "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        info: {
          DEFAULT:    "var(--info)",
          foreground: "var(--info-foreground)",
        },
        border:  "var(--border)",
        input:   "var(--input)",
        ring:    "var(--ring)",

        // Chart tokens
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },

        // Sidebar tokens
        sidebar: {
          DEFAULT:            "var(--sidebar)",
          foreground:         "var(--sidebar-foreground)",
          primary:            "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent:             "var(--sidebar-accent)",
          "accent-foreground":"var(--sidebar-accent-foreground)",
          border:             "var(--sidebar-border)",
          ring:               "var(--sidebar-ring)",
        },
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        none:  "0px",
        xs:    "var(--radius-xs)",
        sm:    "calc(var(--radius) - 4px)",
        md:    "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
        lg:    "var(--radius)",
        xl:    "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) * 2)",
        "3xl": "1.5rem",
        "4xl": "2rem",
        full:  "9999px",
      },

      // ── Box Shadow ────────────────────────────────────────────────────────
      boxShadow: {
        xs:    "var(--shadow-xs)",
        sm:    "var(--shadow-sm)",
        md:    "var(--shadow-md)",
        lg:    "var(--shadow-lg)",
        xl:    "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        none:  "none",
      },

      // ── Font Family — Revsphere / Figma: Inter primary ───────────────────────
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif:   ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
        satoshi: ["Satoshi", "Inter", "ui-sans-serif", "sans-serif"],
      },

      // ── Font Size ─────────────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem",  { lineHeight: "0.875rem" }],
        xs:    ["0.75rem",   { lineHeight: "1rem" }],
        sm:    ["0.875rem",  { lineHeight: "1.25rem" }],
        base:  ["1rem",      { lineHeight: "1.5rem" }],
        lg:    ["1.125rem",  { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",   { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem" }],
        "3xl": ["1.875rem",  { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",   { lineHeight: "2.5rem" }],
        "5xl": ["3rem",      { lineHeight: "1" }],
        "6xl": ["3.75rem",   { lineHeight: "1" }],
        "7xl": ["4.5rem",    { lineHeight: "1" }],
        "8xl": ["6rem",      { lineHeight: "1" }],
        "9xl": ["8rem",      { lineHeight: "1" }],
      },

      // ── Keyframe Animations ───────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to:   { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to:   { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to:   { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to:   { opacity: "0", transform: "scale(0.95)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        "accordion-down":      "accordion-down 0.2s ease-out",
        "accordion-up":        "accordion-up 0.2s ease-out",
        "fade-in":             "fade-in 0.15s ease-out",
        "fade-out":            "fade-out 0.15s ease-in",
        "slide-in-from-top":   "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom":"slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left":  "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
        "zoom-in":             "zoom-in 0.15s ease-out",
        "zoom-out":            "zoom-out 0.15s ease-in",
        "spin-slow":           "spin-slow 3s linear infinite",
        pulse:                 "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer:               "shimmer 2s linear infinite",
      },

      // ── Sidebar width (used by shadcn sidebar) ────────────────────────────
      width: {
        sidebar:            "var(--spacing-64)",
        "sidebar-collapsed": "var(--spacing-12)",
      },
    },
  },

  plugins: [],
};

export default config;
