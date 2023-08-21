import { cn } from "@/lib/cva";
import type { ReactNode } from "react";

const Container = (props: { children?: ReactNode; className?: string }) => {
  return (
    <section
      className={cn(
        "remove-scroll-bar relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col gap-8 overflow-y-scroll px-4 pt-24",
        props.className
      )}
    >
      {props.children}
    </section>
  );
};

export default Container;
