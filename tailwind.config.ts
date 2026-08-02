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
        bg: "#2B2B2B",
        "bg-secondary": "#343434",
        beige: "#BC9A7A",
        gold: "#CDA364",
        brown: "#8C6F52",
        "text-light": "#FEF5E1",
        "text-muted": "#BBAA95",
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
