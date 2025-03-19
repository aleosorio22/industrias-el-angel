/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif", ...fontFamily.sans],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"], // Para títulos
      },
      fontSize: {
        "display-1": ["3.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-2": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "heading-1": ["2.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-2": ["2rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "heading-3": ["1.75rem", { lineHeight: "1.375" }],
        "heading-4": ["1.5rem", { lineHeight: "1.375" }],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1)",
        hard: "0 10px 40px -10px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

