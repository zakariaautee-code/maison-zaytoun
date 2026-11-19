import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Core anti-slop palette */
        espresso: {
          DEFAULT: "#121A15",
          soft: "#1B261F",
          raised: "#25332A",
        },
        plaster: {
          DEFAULT: "#F4EBDD",
          deep: "#E8DBCA",
          shade: "#D8C7B0",
        },
        travertine: "#F4EBDD",
        paper: "#FBF6EE",
        terracotta: "#C85A32",
        mint: "#1E6B52",
        saffron: {
          DEFAULT: "#C85A32",
          dark: "#A8431F",
        },
        coal: "#0E130F",
        brass: {
          DEFAULT: "#C9A253",
          light: "#E0C281",
          deep: "#8E6B2E",
        },
        /* Heritage riad editorial — warm aubergine, zellige cream, old gold. */
        aubergine: {
          DEFAULT: "#5A3A38",
          deep: "#3E2725",
          soft: "#6E4846",
        },
        zellige: "#F7F2E9",
        /* Back-compat aliases used by the existing sections */
        ink: {
          DEFAULT: "#121A15",
          soft: "#6B645A",
          muted: "#8E8678",
        },
        cream: {
          DEFAULT: "#F4EBDD",
          deep: "#E8DBCA",
          dark: "#D8C7B0",
        },
        sand: "#E8DBCA",
        mocha: {
          DEFAULT: "#121A15",
          dark: "#0B100C",
          deep: "#070A07",
          light: "#1B261F",
        },
        gold: {
          DEFAULT: "#C9A253",
          light: "#E0C281",
          deep: "#8E6B2E",
        },
        terra: {
          DEFAULT: "#C85A32",
          dark: "#A8431F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Forum", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
        caption: "0.22em",
      },
      opacity: {
        12: "0.12",
      },
      boxShadow: {
        soft: "0 14px 44px -20px rgba(0,0,0,0.35)",
        lift: "0 24px 64px -24px rgba(0,0,0,0.45)",
        tactile: "0 10px 0 -4px rgba(142,107,46,0.25), 0 18px 34px -12px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg,#8E6B2E 0%,#E0C281 50%,#8E6B2E 100%)",
        "zellige": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23C9A253' stroke-opacity='0.13' stroke-width='1'%3E%3Cpath d='M32 4 60 32 32 60 4 32Z'/%3E%3Cpath d='M32 14 50 32 32 50 14 32Z'/%3E%3Ccircle cx='32' cy='32' r='7'/%3E%3Cpath d='M32 0v14M32 50v14M0 32h14M50 32h14'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        "arch-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        watermark: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "arch-zoom": "arch-zoom 12s ease-in-out infinite alternate",
        "fade-up": "fade-up 0.7s ease-out both",
        watermark: "watermark 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
