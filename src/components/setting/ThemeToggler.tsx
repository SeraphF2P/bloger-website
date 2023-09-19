"use client";

import { Btn, Icons } from "@/ui";
import { motion as m } from "framer-motion";
import { useTheme } from "next-themes";
import { useLayoutEffect, type FC, type PropsWithChildren } from "react";

interface ThemeTogglerBtnProps extends PropsWithChildren {
	toggledTheme: string;
	setTheme: (val: string) => void;
}
const ThemeTogglerBtn: FC<ThemeTogglerBtnProps> = ({
	toggledTheme,
	setTheme,
	children,
}) => {
	const { theme } = useTheme();
	const isActive = theme == toggledTheme;
	return (
		<Btn
			className={` relative rounded-none flex w-full items-center justify-center p-2  ${
				isActive ? " text-yellow-300 dark:text-yellow-400" : ""
			}`}
			onClick={() => setTheme(toggledTheme)}
		>
			{children}
			{isActive && (
				<m.span
					layoutId="active-theme-border"
					className=" absolute inset-0 z-10  border-2 border-revert-theme pointer-events-none"
				/>
			)}
			<span className=" sr-only">{toggledTheme}</span>
		</Btn>
	);
};

export default function ThemeToggle() {
	const { setTheme, systemTheme, themes } = useTheme();
	useLayoutEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme != null) {
			setTheme(savedTheme);
		} else {
			setTheme(systemTheme || themes[0]);
		}
	}, [setTheme, systemTheme, themes]);
	return (
		<div className=" flex w-full  ">
			<ThemeTogglerBtn setTheme={setTheme} toggledTheme="light">
				<Icons.sun className=" h-6 w-6 " />
			</ThemeTogglerBtn>
			<ThemeTogglerBtn setTheme={setTheme} toggledTheme="dark">
				<Icons.moon className=" h-6 w-6 " />
			</ThemeTogglerBtn>
		</div>
	);
}
