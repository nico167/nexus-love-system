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
        "slide-up-delay": "slideUp 0.8s ease-out 0.2s forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "counter-pop": "counterPop 0.15s ease-out forwards",
        "particle-fall": "particleFall var(--duration, 2s) ease-in forwards",
        "shimmer": "shimmer 2.5s linear infinite",
        "heart-burst": "heartBurst 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        counterPop: {
          "0%": { transform: "scale(1.15)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        particleFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        heartBurst: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "60%": { transform: "scale(1.3) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(233,30,140,0.2), 0 0 60px rgba(233,30,140,0.05)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(233,30,140,0.5), 0 0 80px rgba(233,30,140,0.2)",
          },
        },
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
