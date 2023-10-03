"use client";

import { Thumb, Track } from "@/components/ui/ScrollBar";
import { fontOutfit } from "@/config/fonts";
import { cn } from "@/lib/cva";
import { motion as m, HTMLMotionProps } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentPropsWithRef } from "react";
import { forwardRef, useRef } from "react";

const ScrollBar = dynamic(() => import("@/components/ui/ScrollBar"), {
	ssr: false,
});
const Container = forwardRef<
	HTMLElement,
	ComponentPropsWithRef<"main"> & HTMLMotionProps<"main">
>(({ children, className, ...props }, forwardRef) => {
	const ref = useRef<HTMLElement>(null);
	if (forwardRef) {
		forwardRef = ref;
	}
	return (
		<m.main
			ref={ref}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
			className={cn(
				fontOutfit.variable,
				"font-outfit h-screen py-24 text-revert-theme  remove-scroll-bar  shadow shadow-dynamic/40 relative mx-auto flex w-full max-w-[420px] flex-col gap-4 overflow-y-scroll px-2",
				className
			)}
			{...props}
		>
			{children}

			<ScrollBar orientation="x" axis="y" throttleDelay={20} container={ref}>
				<Track className="z-40   rotate-90 origin-bottom-left  w-4 h-[100dvw] flex left-0  bottom-8    bg-revert-theme/20 ">
					<Thumb className="  w-2 bg-primary" />
				</Track>
			</ScrollBar>
		</m.main>
	);
});
Container.displayName = "Container";
export default Container;
