import { api } from "../../utils/api";
import { Icons } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { motion as m } from "framer-motion";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface ListLink {
	children: ReactNode;
	href: LinkProps["href"];
}
const ListLink = ({ children, href }: ListLink) => {
	const { asPath } = useRouter();
	const isActive = asPath === href;

	return (
		<li className={" relative   flex-[1_1_40px] p-4 "}>
			{children}
			<Link className=" absolute inset-0" href={href}></Link>
			<span className="sr-only">{href.toString()}</span>

			{isActive && (
				<m.span
					layoutId="nav-underline"
					transition={{ layout: { duration: 0.2, ease: "linear" } }}
					className={`   bg-primary rounded-t-md h-1.5   left-2 right-2   absolute   bottom-0`}
				/>
			)}
		</li>
	);
};

const Navbar = () => {
	const { user } = useUser();
	const { asPath } = useRouter();
	const notificationCount = api.notification.count.useQuery();
	const isThereNewNotification =
		notificationCount.data != 0 && asPath != "/notification";

	return (
		<header className=" fixed z-40 top-0  left-1/2 -translate-x-1/2  flex w-full justify-center max-w-[420px]  ">
			<ul className=" flex relative w-full bg-theme text-revert-theme  items-center justify-between  ">
				<ListLink href="/">
					<Icons.news />
				</ListLink>
				<ListLink href="/drafts">
					<Icons.drafts />
				</ListLink>
				<ListLink href={"/profile" + `${user ? `/${user?.id}` : ""}`}>
					<Icons.userIcon />
				</ListLink>
				<ListLink href="/notification">
					<Icons.notification
						className={`${
							isThereNewNotification ? "-rotate-[30deg]" : " rotate-0"
						} transition-transform`}
					/>
					{isThereNewNotification && (
						<div className=" pointer-events-none bg-red-500 flex justify-center  items-center rounded-full absolute top-2  right-2 aspect-square w-6 h-6">
							{notificationCount.data}
						</div>
					)}
				</ListLink>
				<ListLink href="/chat">
					<Icons.chat />
				</ListLink>
				<ListLink href="/setting">
					<Icons.settings />
				</ListLink>
			</ul>
		</header>
	);
};

export default Navbar;
