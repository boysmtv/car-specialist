/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        background: "#FFFDFB",
        surface: "#FFFFFF",
        primary: { DEFAULT: "#E8722A", dark: "#9A3412" },
        accent: { DEFAULT: "#FDBA74" },
        gold: { DEFAULT: "#EE8A3A", light: "#FCD9B8", dark: "#B45309" },
        muted: "#6B7280",
        border: "#E5E7EB",
        danger: "#DC2626",
        wa: "#25D366"
      },
      borderRadius: { lg: "0.75rem", xl: "1rem" },
      boxShadow: { card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08)" }
    }
  },
  plugins: []
};
