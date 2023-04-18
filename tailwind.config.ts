/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import c from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: c.slate["100"],
        black: c.slate["900"],
        primary: "rgb(var(--primary) , <alpha-value>)",
        btn: "rgb(var(--primary) , <alpha-value>)",
        "btn-hover": "rgb(var(--btn-hover) , <alpha-value>)",
        "btn-muted": "rgb(var(--btn-muted) , <alpha-value>)",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      screens: {
        min: "320px",
        xsm: "420px",
        xs: "576px",
      },
      gridAutoColumns: {
        fluid: "repeat(auto-fit,minmax(0,1fr))",
      },
      gridAutoRows: {
        fluid: "repeat(auto-fit,minmax(0,1fr))",
      },
      aspectRatio: {
        square: "1",
        "golden-w": "16/9",
        "golden-h": "9/16",
      },
      animation: {
        reset: "reset var(--reset-duration) infinite var(--reset-delay)",
      },
      keyframes: {
        reset: {
          "50%": {
            transform:
              "translate(0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);",
          },
          "0%,100%": {
            transform:
              "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));",
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-brand-colors"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
