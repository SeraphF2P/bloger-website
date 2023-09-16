import { usePusher } from "../../context/PusherContext";
import { toChatId } from "../../utils";
import { api } from "../../utils/api";
import { Container, NextImage, NotificationDot } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Error from "next/error";
import Link from "next/link";
import { useState } from "react";

const Chat: NextPage = () => {
	const auth = useUser();
	const { data } = api.friend.getAllChat.useQuery();

	if (!auth.isSignedIn) return <Error withDarkMode statusCode={401} />;
	return (
		<Container>
			{data &&
				data.map(({ chatPartner, lastMsg }) => {
					const chatId = toChatId(auth.user.id, chatPartner.id);
					return (
						<ChatProfile
							userId={auth.user.id}
							key={chatId}
							{...chatPartner}
							chatId={chatId}
							lastMsg={lastMsg}
						/>
					);
				})}
		</Container>
	);
};
const ChatProfile = ({
	chatId,
	userId,
	lastMsg,
	...friend
}: {
	chatId: string;
	userId: string;
	lastMsg: ChatMSGType | undefined;
} & AutherType) => {
	type chatInfo = {
		count: number;
		lastMsg: ChatMSGType | undefined;
	};

	const [info, setInfo] = useState<chatInfo>({
		count: 0,
		lastMsg,
	});
	usePusher({
		key: `chat:${chatId}:${userId}`,
		event: `chatNotification`,
		cb: (msg: ChatMSGType) => {
			setInfo((prev) => {
				console.log(msg);
				return { count: prev.count + 1, lastMsg: msg };
			});
		},
	});
	return (
		<div className=" relative flex items-center p-2 gap-2 bg-revert-theme/10  h-24 w-full">
			<NextImage
				sizes="80px, 80px"
				className=" w-20 h-20 rounded-full overflow-hidden"
				src={friend.profileImageUrl}
				alt={friend.username}
			/>
			<NotificationDot count={info.count} />
			<div className=" flex-1">
				<h3>{friend.username}</h3>
				<p>{info.lastMsg?.content || ""}</p>
			</div>
			<Link className=" absolute inset-0" href={`chat/${chatId}`} />
		</div>
	);
};
export default Chat;
