/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#FF6A00",
          hover: "#e05e00",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
