"use client";

import { cn } from "@/lib/cva";
import { Btn } from "@/ui";
import { motion as m } from "framer-motion";
import { type ReactNode, useId, useState } from "react";

export default function ThemeToggle({
	defaultValue,
	toggleValues,
	fn,
}: {
	defaultValue?: string;
	toggleValues: { name: string; component: ReactNode }[];
	fn: (val?: any) => void;
}) {
	const id = useId();
	const [activeVal, setToggled] = useState(defaultValue);
	const toggleHandler = (val: string) => {
		setToggled(val);
		fn(val);
	};
	return (
		<div className=" flex w-full  ">
			{toggleValues &&
				toggleValues.map((opt) => {
					const isActive = activeVal == opt.name;
					return (
						<div key={opt.name} className={`relative w-full`}>
							<Btn
								className={cn(
									`relative rounded-none flex w-full items-center justify-center p-2 `,
									{
										" text-yellow-300 dark:text-yellow-400": isActive,
									}
								)}
								onClick={() => {
									toggleHandler(opt.name);
								}}
							>
								{opt.component}
								<span className=" sr-only">{opt.name}</span>
							</Btn>
							{isActive && (
								<m.span
									layoutId={"active-theme-border" + id}
									className=" absolute inset-0 z-10  border-2 border-revert-theme pointer-events-none"
								/>
							)}
						</div>
					);
				})}
		</div>
	);
}
