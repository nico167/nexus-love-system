import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: "#0a0a0f",
          panel: "#12121a",
          border: "#2a2a3a",
          accent: "#e91e8c",
          glow: "#ff6eb4",
          muted: "#8b8ba3",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
        display: ["var(--font-space)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(233, 30, 140, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(233, 30, 140, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
