import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium blue palette — inspired by Crumb Club / ctrl+
        background: "#F2ECE1",
        foreground: "#1A2258",

        // Primary — Royal Blue
        primary: {
          DEFAULT: "#0034D3",
          foreground: "#FFFFFF",
          dark: "#002AAB",
          light: "#3360E0",
        },

        // Dark — Midnight
        dark: {
          DEFAULT: "#003087",
          foreground: "#FFFFFF",
          light: "#1A2258",
        },

        // Accent — Soft Sky
        accent: {
          DEFAULT: "#CDDCF2",
          foreground: "#003087",
        },

        // Card and surfaces — pure white
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A2258",
        },

        // Muted — warm beige
        muted: {
          DEFAULT: "#E8E4DE",
          foreground: "#6B6560",
        },

        // Border — soft warm
        border: "rgba(0, 48, 135, 0.08)",
        input: "rgba(0, 48, 135, 0.12)",
        ring: "#0034D3",

        // Others
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A2258",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 52, 211, 0.04)',
        'card': '0 1px 4px rgba(0, 52, 211, 0.06)',
        'elevated': '0 8px 30px rgba(0, 52, 211, 0.08)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
