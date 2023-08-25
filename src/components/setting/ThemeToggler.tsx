"use client";

import { Btn, Icons } from "@/ui";
import { useTheme } from "next-themes";
import { type FC, type PropsWithChildren } from "react";

interface ThemeTogglerBtnProps extends PropsWithChildren {
  toggledTheme: string;
}
const ThemeTogglerBtn: FC<ThemeTogglerBtnProps> = ({
  toggledTheme,
  children,
}) => {
  const { setTheme, theme } = useTheme();
  const isActive = theme == toggledTheme;
  return (
    <Btn
      className={` rounded-none flex w-full items-center justify-center p-2  ${
        isActive
          ? "border-2 border-revert-theme text-yellow-300 dark:text-yellow-400"
          : ""
      }`}
      onClick={() => setTheme(toggledTheme)}
    >
      {children}
      <span className=" sr-only">{toggledTheme}</span>
    </Btn>
  );
};

export default function ThemeToggle() {
  return (
    <div className=" flex w-full  ">
      <ThemeTogglerBtn toggledTheme="light">
        <Icons.sun className=" h-6 w-6 " />
      </ThemeTogglerBtn>
      <ThemeTogglerBtn toggledTheme="dark">
        <Icons.moon className=" h-6 w-6 " />
      </ThemeTogglerBtn>
    </div>
  );
}
