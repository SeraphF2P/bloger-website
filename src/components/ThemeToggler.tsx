"use client";

import { Btn, Icons } from "@/components";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div className=" flex w-full divide-x-2 ">
      <Btn
        status="bg-green-500 dark:bg-green-600 text-yellow-400"
        hasStatus={theme === "light" ? true : false}
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("light")}
      >
        <Icons.sun className=" h-6 w-6 " />
        <span className=" sr-only">Light</span>
      </Btn>
      <Btn
        status="bg-green-500 dark:bg-green-600 text-yellow-400"
        hasStatus={theme == "dark"}
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("dark")}
      >
        <Icons.moon className=" h-6 w-6 " />
        <span className=" sr-only">Dark</span>
      </Btn>
      <Btn
        status="bg-green-500 dark:bg-green-600 text-yellow-400"
        hasStatus={theme == "system"}
        className=" flex w-full items-center justify-center p-2 "
        onClick={() => setTheme("system")}
      >
        <Icons.system className=" h-6 w-6 " />
        <span className=" sr-only">System</span>
      </Btn>
    </div>
  );
}
