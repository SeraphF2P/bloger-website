"use client";

import { cn, variants, type variantsType } from "@/lib/cva";
import { forwardRef } from "react";
import type { ComponentPropsWithRef, MouseEvent } from "react";

export interface BtnProps
	extends ComponentPropsWithRef<"button">,
		variantsType {}

const Btn = forwardRef<HTMLButtonElement, BtnProps>(
	(
		{ onClick, className, variant, shape, children, type = "button", ...props },
		ref
	) => {
		return (
			<button
				ref={ref}
				onClick={(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
					e.stopPropagation();
					if (typeof onClick === "function") {
						onClick(e);
					}
				}}
				className={cn(variants({ variant, shape }), className)}
				type={type}
				{...props}
			>
				{children}
			</button>
		);
	}
);
Btn.displayName = "Button";
export default Btn;
