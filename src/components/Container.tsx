import { cn } from "@/lib/cva";
import type { ReactNode } from "react";

const Container = (props: { children: ReactNode; className?: string }) => {
  return (
    <main
      className={cn(
        "mx-auto min-h-screen max-w-[420px] px-4 pt-24",
        props.className
      )}
    >
      {props.children}
    </main>
  );
};

export default Container;
