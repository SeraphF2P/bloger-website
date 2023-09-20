"use client";

import { Icons, StyledToggleBtn } from "@/ui";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
	const { setTheme, systemTheme } = useTheme();
	return (
		<StyledToggleBtn
			toggleValues={[
				{ name: "light", component: <Icons.sun className=" h-6 w-6 " /> },
				{ name: "dark", component: <Icons.moon className=" h-6 w-6 " /> },
			]}
			defaultValue={systemTheme}
			fn={(value: string) => setTheme(value)}
		/>
	);
}
