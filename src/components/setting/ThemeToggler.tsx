"use client";

import { Icons, StyledToggleBtn } from "@/ui";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
	const { setTheme, systemTheme, themes } = useTheme();
	let defaultValue;
	if (typeof window !== "undefined") {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme != null) {
			defaultValue = storedTheme;
		} else if (systemTheme) {
			defaultValue = systemTheme;
		} else {
			defaultValue = themes[0];
		}
	}
	return (
		<StyledToggleBtn
			toggleValues={[
				{ name: "light", component: <Icons.sun className=" h-6 w-6 " /> },
				{ name: "dark", component: <Icons.moon className=" h-6 w-6 " /> },
			]}
			defaultValue={defaultValue}
			fn={(value: string) => setTheme(value)}
		/>
	);
}
