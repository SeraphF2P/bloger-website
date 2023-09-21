import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export const MyPlugin = plugin(
  ({ addBase, addUtilities }) => {
    addBase({
      ".dark": {
        "--theme": "30,41,59", //? slate["800"]
        "--revert-theme": "226,232,240", //? slate["200"]
        "--theme-shadow": "245,245,245", //?
        "--primary": "139,92,246", //?violet["500"]
        "--alert": "200,50,50",
        "--success": "50,200,50",
      },
      ".light": {
        "--theme": "226,232,240", //? slate["200"]
        "--revert-theme": "30,41,59", //? slate["800"]
        "--theme-shadow": "0,0,0", //?
        "--primary": "167,139,250", //?violet["400"]
        "--alert": "200,50,50",
        "--success": "50,200,50",
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
          theme: "rgb(var(--theme),<alpha-value>)",
          "revert-theme": "rgb(var(--revert-theme),<alpha-value>)",
          primary: "rgb(var(--primary),<alpha-value>)",
          variant: "rgb(var(--variant,0,0,0),<alpha-value>)",
          alert: "rgb(var(--alert),<alpha-value>)",
          success: "rgb(var(--success),<alpha-value>)",
        },

        boxShadow: {
          overlay: "inset 0 0 200px 0 rgba(255,255,255,0)",
        },
        boxShadowColor: {
          dynamic: "rgb(var(--theme-shadow),<alpha-value>)",
        },
        screens: {
          mn: "420px",
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
          fadein:
            "fadein var(--fadein-duration,0.3s) forwards  var(--fadein-delay,0s)",
          fadeout:
            "fadeout var(--fadeout-duration,0.3s) forwards var(--fadeout-delay,0s)",
          buzz:
            "buzz 2s infinite linear  ",
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
          fadein: {
            to: {
              opacity: "var(--fadein-opacity,1)",
              transform:
                "translate(var(--fade-translate-x,0) , var(--fade-translate-y,0)) rotate(var(--fade-rotate)) skewX(var(--fade-skew-x,0)) skewY(var(--fade-skew-y,0)) scaleX(var(--fade-scale-x,1)) scaleY(var(--fade-scale-y,1));",
            },
          },
          fadeout: {
            from: {
              opacity: "var(--fadeout-opacity,1)",
              transform:
                "translate(var(--fade-translate-x,0) , var(--fade-translate-y,0)) rotate(var(--fade-rotate)) skewX(var(--fade-skew-x,0)) skewY(var(--fade-skew-y,0)) scaleX(var(--fade-scale-x,1)) scaleY(var(--fade-scale-y,1));",
            },
          },
          buzz: {
            "0%,20%,40%,60%,80%,100%": { 
              transform:
                "rotate(0deg) ",
            },
            "10%,50%": {
              transform:
                "rotate(-12.5deg) ",
            },
            "30%,70%": {
              transform:
                "rotate(12.5deg)",
            },
          },
         
      },
    },
  },
});
export default MyPlugin;
