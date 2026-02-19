/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#16A34A",
        "primary-dark": "#15803D",
        "primary-light": "#dcfce7",
        accent: "#84CC16",
        background: "#f8fafc",
        surface: "#ffffff",
        "text-primary": "#0f172a",
        "text-secondary": "#64748b",
        border: "#e2e8f0",
      },
    },
  },
  plugins: [],
};
