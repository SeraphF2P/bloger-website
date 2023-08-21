import { MyPlugin } from "./MyPlugin";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import twScrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [],
  plugins: [MyPlugin, twScrollbar({ nocompatible: true }), typography, forms],
} satisfies Config;
export default config;
