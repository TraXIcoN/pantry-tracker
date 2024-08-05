import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#121212",
        foreground: "#ffffff",
        border: "#333333",
        input: "#1e1e1e",
        ring: "#bb86fc",
        primary: {
          DEFAULT: "#bb86fc",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#03dac6",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#cf6679",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#3a3a3a",
          foreground: "#b0b0b0",
        },
        accent: {
          DEFAULT: "#03dac6",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#1e1e1e",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#1e1e1e",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
