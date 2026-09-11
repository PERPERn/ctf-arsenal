import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        brand2: "rgb(var(--brand2) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgb(var(--brand) / 0.45)",
        card: "0 8px 30px -12px rgb(0 0 0 / 0.5)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "grid-pan": { "0%": { backgroundPosition: "0 0" }, "100%": { backgroundPosition: "40px 40px" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blink: "blink 1s steps(1) infinite",
        shimmer: "shimmer 2s infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "grid-pan": "grid-pan 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
