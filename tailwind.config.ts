import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // A more professional and subtle color palette.
        // The 'base' colors are dark, but not black, to avoid harshness.
        // The 'accent' colors are vibrant but not distracting.
        base: {
          DEFAULT: "#121212", // A very dark grey, softer than pure black.
          surface: "#1E1E1E", // A slightly lighter grey for card backgrounds.
          muted: "#2A2A2A", // A subtle grey for borders and dividers.
        },
        accent: {
          DEFAULT: "#3B82F6", // A professional blue.
          soft: "#60A5FA", // A lighter blue for hover states.
          deep: "#2563EB", // A darker blue for active states.
        },
        ink: {
          DEFAULT: "#F8F8F8", // An off-white for primary text.
          muted: "#A8A8A8", // A grey for secondary text.
          faint: "#686868", // A darker grey for placeholder text.
        },
        // Admin panel tokens adapt to the selected light, dark, or system theme.
        admin: {
          bg: "rgb(var(--admin-bg) / <alpha-value>)",
          panel: "rgb(var(--admin-panel) / <alpha-value>)",
          border: "rgb(var(--admin-border) / <alpha-value>)",
          text: "rgb(var(--admin-text) / <alpha-value>)",
          muted: "rgb(var(--admin-muted) / <alpha-value>)",
          accent: "#4F46E5",
          accentHover: "#4338CA",
          danger: "rgb(var(--admin-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Subtle shadows for depth.
      boxShadow: {
        subtle: "0 4px 12px rgba(0, 0, 0, 0.1)",
        medium: "0 8px 24px rgba(0, 0, 0, 0.1)",
      },
      // Keyframes for subtle, purposeful animations.
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      // Animations for subtle, purposeful motion.
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideIn: "slideIn 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
