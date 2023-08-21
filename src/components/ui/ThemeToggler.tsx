"use client";

import { Btn, Icons } from "@/ui";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className=" flex w-full divide-x-2 ">
      <Btn
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("light")}
      >
        <Icons.sun className=" h-6 w-6 " />
        <span className=" sr-only">Light</span>
      </Btn>
      <Btn
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("dark")}
      >
        <Icons.moon className=" h-6 w-6 " />
        <span className=" sr-only">Dark</span>
      </Btn>
      <Btn
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("system")}
      >
        <Icons.system className=" h-6 w-6 " />
        <span className=" sr-only">System</span>
      </Btn>
    </div>
  );
}
