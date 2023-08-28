"use client";

import { fontOutfit } from "@/config/fonts";
import { cn } from "@/lib/cva";
// import { ScrollBar } from "@/ui";
import { motion as m } from "framer-motion";
import React from "react";
import type { ReactNode } from "react";

const Container = (props: { children?: ReactNode; className?: string }) => {
  // const ref = useRef<HTMLDivElement>(null);

  return (
    <m.main
      // ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={cn(
        fontOutfit.variable,
        "font-outfit h-screen pt-24  remove-scroll-bar  shadow shadow-dynamic/40 relative mx-auto flex w-full max-w-[420px] flex-col gap-8 overflow-y-scroll px-2",
        props.className
      )}
    >
      {props.children}
      {/* <ScrollBar scrollContainer={ref}>
        <ScrollBar.track className="z-40 left-0 bottom-0  top-0 bg-revert-theme/20 w-6">
          <ScrollBar.thumb className="bg-primary" />
        </ScrollBar.track>
      </ScrollBar> */}
    </m.main>
  );
};

export default Container;
