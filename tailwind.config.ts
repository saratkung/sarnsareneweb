import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-secondary": "rgb(var(--color-bg-secondary) / <alpha-value>)",
        beige: "rgb(var(--color-beige) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        "text-light": "rgb(var(--color-text-light) / <alpha-value>)",
        // Secondary text per brand spec: Charcoal at a fixed 65% opacity,
        // not an independent hue — so this ignores /NN opacity modifiers.
        "text-muted": "rgb(var(--color-text-light) / 0.65)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "var(--font-thai)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "var(--font-thai)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
