import { usePusher } from "../../context/PusherContext";
import axiosClient from "../../lib/axiosClient";
import { api } from "../../utils/api";
import { Container, NextImage, NotificationDot } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import Error from "next/error";
import Link from "next/link";
import { useState } from "react";

const Chat: NextPage = () => {
	const auth = useUser();
	const getFriends = api.user.getFriends.useQuery();
	if (!auth.isSignedIn)
		return <Error withDarkMode title="unAutheraize" statusCode={401} />;
	return (
		<Container>
			{getFriends.data &&
				getFriends.data.map((friend) => {
					const chatId = [auth.user.id, friend.id].sort().join("--");
					return (
						<ChatProfile
							userId={auth.user.id}
							key={chatId}
							{...friend}
							chatId={chatId}
						/>
					);
				})}
		</Container>
	);
};
const ChatProfile = ({
	chatId,
	userId,
	...friend
}: { chatId: string; userId: string } & AutherType) => {
	type chatInfo = {
		count: number;
		lastMsg: ChatMSGType | null;
	};
	const { data } = useQuery<{
		data: chatInfo;
	}>({
		queryFn: async () => {
			return await axiosClient(`chat/count?chatId=${chatId}`);
		},
	});
	const [info, setInfo] = useState<chatInfo>(
		data?.data || {
			count: 0,
			lastMsg: null,
		}
	);
	usePusher({
		key: `chat:${userId}:${chatId}`,
		event: `chatNotification`,
		cb: (msg: ChatMSGType) => {
			setInfo((prev) => {
				return { count: prev.count + 1, lastMsg: msg };
			});
		},
	});
	if (!data) return null;
	const { count, lastMsg } = info;
	return (
		<div className=" relative flex items-center p-2 gap-2 bg-revert-theme/10  h-24 w-full">
			<NextImage
				sizes="80px, 80px"
				className=" w-20 h-20 rounded-full overflow-hidden"
				src={friend.profileImageUrl}
				alt={friend.username}
			/>
			<NotificationDot count={count} />
			<div className=" flex-1">
				<h3>{friend.username}</h3>
				<p>{lastMsg?.content || ""}</p>
			</div>
			<Link className=" absolute inset-0" href={`chat/${chatId}`} />
		</div>
	);
};
export default Chat;
