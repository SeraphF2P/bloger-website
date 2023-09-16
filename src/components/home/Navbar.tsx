import { usePusher } from "../../context/PusherContext";
import { Icons, NotificationDot } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { motion as m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";

interface ListLink {
	children: ReactNode;
	href: string;
}
const ListLink = ({ children, href }: ListLink) => {
	const { asPath } = useRouter();
	const isActive = href != "/" ? asPath.includes(href) : asPath == "/";

	return (
		<li className={" relative   flex-[1_1_40px] p-4 "}>
			{children}
			<Link className=" absolute inset-0" href={href}></Link>
			<span className="sr-only">{href}</span>

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
					<Notification
						userId={user?.id || ""}
						isActivePath={asPath == "/notification"}
					/>
				</ListLink>
				<ListLink href="/chat">
					<ChatNotification
						userId={user?.id || ""}
						isActivePath={asPath.startsWith("/chat")}
					/>
				</ListLink>
				<ListLink href="/setting">
					<Icons.settings />
				</ListLink>
			</ul>
		</header>
	);
};
export default Navbar;

function Notification({
	userId,
	isActivePath,
}: {
	userId: string;
	isActivePath: boolean;
}) {
	const [msgnotesCount, setMsgNotesCount] = useState(0);
	const isThereNewNotification = msgnotesCount > 0;

	usePusher({
		key: `note:${userId}`,
		event: "note",
		cb: () => {
			setMsgNotesCount((prev) => prev + 1);
		},
	});

	useEffect(() => {
		if (isActivePath) {
			setMsgNotesCount(0);
		}
	}, [isActivePath, setMsgNotesCount]);

	return (
		<>
			<Icons.notification
				className={`${
					isThereNewNotification ? "-rotate-[30deg]" : " rotate-0"
				} transition-transform`}
			/>
			{isThereNewNotification && userId && (
				<NotificationDot count={msgnotesCount} />
			)}
		</>
	);
}
function ChatNotification({
	userId,
	isActivePath,
}: {
	userId: string;
	isActivePath: boolean;
}) {
	const [msgnotesCount, setMsgNotesCount] = useState(0);

	usePusher({
		key: `chat:${userId}`,
		event: "messageNotifications",
		cb: () => {
			setMsgNotesCount((prev) => prev + 1);
		},
	});
	const isThereNewMsg = msgnotesCount > 0;
	useEffect(() => {
		if (isActivePath) {
			setMsgNotesCount(0);
		}
	}, [isActivePath, setMsgNotesCount]);
	return (
		<>
			<Icons.chat className={`${isThereNewMsg ? "animate-buzz" : ""} `} />
			{isThereNewMsg && userId && <NotificationDot count={msgnotesCount} />}
		</>
	);
}
