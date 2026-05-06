/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jl: {
          black: "#000000",
          white: "#ffffff",
          gray: "#f5f5f5",
          border: "#e5e5e5",
          muted: "#737373",
          save: "#f3e6a6",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        raleway: ["Raleway", "Arial", "system-ui", "sans-serif"],
        sans: [
          "Clash Grotesk",
          "Inter",
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)",
      },
      keyframes: {
        "scroll-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        /** Bottom snackbar: slide + fade */
        "toast-rise": {
          from: {
            opacity: "0",
            transform: "translate3d(0, calc(100% + 1.5rem), 0)",
          },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        /** 2s ease-out both — on-scroll fade (Reveal); legible fade-in on fast loads */
        "scroll-fade": "scroll-fade 2s ease-out both",
        "toast-rise": "toast-rise 0.42s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
