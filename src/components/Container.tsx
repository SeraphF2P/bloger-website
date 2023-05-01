import { cn } from "@/lib/cva";
import type { ReactNode } from "react";

const Container = (props: { children?: ReactNode; className?: string }) => {
  return (
    <main
      className={cn(
        " remove_scroll_bar relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col gap-8 overflow-y-scroll px-4 pt-24",
        props.className
      )}
    >
      {props.children}
    </main>
  );
};

export default Container;
