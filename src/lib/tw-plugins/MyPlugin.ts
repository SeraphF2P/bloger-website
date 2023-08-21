import c from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export const MyPlugin = plugin(
  ({ addBase, addUtilities }) => {
    addBase({
      ".dark": {
        "--theme": c.slate["800"],
        "--revert-theme": c.slate["200"],
        "--primary": c.violet["400"],
      },
      ".light": {
        "--theme": c.slate["200"],
        "--revert-theme": c.slate["800"],
        "--primary": c.violet["500"],
      },
    });
    addBase({
      "*": {
        " @apply border-border": {},
      },
      body: {
        "@apply bg-theme text-revert-theme": {},
        "font-feature-settings": '"rlig" 1, "calt" 1',
      },
      h1: { "@apply text-2xl": {} },
      h2: { "@apply text-xl": {} },
      h3: { "@apply text-lg": {} },
      h4: { "@apply text-base": {} },
      p: { "@apply text-sm": {} },
      li: { "@apply list-none": {} },
      a: { "@apply !text-current": {} },
    });
    addUtilities({
      ".remove-scroll-bar": {
        "scroll-behavior": "smooth",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
      ".remove-scroll-bar::-webkit-scrollbar": {
        display: "none",
      },
    });
  },
  {
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)", ...fontFamily.sans],
          inter: ["var(--font-inter)"],
          outfit: ["var(--font-outfit)"],
        },

        colors: {
          theme: "var(--theme)",
          "revert-theme": "var(--revert-theme)",
          primary: "var(--primary)",
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
  }
);
export default MyPlugin;
