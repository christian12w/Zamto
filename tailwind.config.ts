/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-zamtoNavy",
    "bg-zamtoOrange",
    "hover:bg-zamtoNavy/90",
    "hover:bg-zamtoOrange/90",
    "text-zamtoNavy",
    "text-zamtoOrange",
    "border-zamtoNavy",
    "border-zamtoOrange",
    "from-zamtoNavy",
    "to-zamtoOrange",
  ],
  theme: {
    extend: {
      colors: {
        zamtoNavy: "#003366",
        zamtoOrange: "#FF6B35",
        zamtoLight: "#f8f9fa",
      },
    },
  },
  plugins: [],
}