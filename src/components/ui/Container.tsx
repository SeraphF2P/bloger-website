"use client";

import { Thumb, Track } from "@/components/ui/ScrollBar";
import { fontOutfit } from "@/config/fonts";
import { cn } from "@/lib/cva";
import { motion as m } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import type { ReactNode } from "react";

const ScrollBar = dynamic(() => import("@/components/ui/ScrollBar"), {
  ssr: false,
});
const Container = (props: { children?: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <m.main
      ref={ref}
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

      <ScrollBar container={ref}>
        <Track className="z-40 w-2 transition-[width] duration-300 group hover:w-6 flex left-0 bottom-0  top-0 bg-revert-theme/20 ">
          <Thumb className=" w-1 transition-[width] duration-300 group-hover:w-2 bg-primary" />
        </Track>
      </ScrollBar>
    </m.main>
  );
};

export default Container;
