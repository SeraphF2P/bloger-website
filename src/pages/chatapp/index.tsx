import { NoContent } from "@/components/index";
import { usePusher } from "@/context/PusherContext";
import {
	Container,
	ErrorPages,
	Loading,
	NextImage,
	NotificationDot,
} from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const Chat: NextPage = () => {
	const auth = useUser();
	const { data, isLoading } = api.friend.getAllChat.useQuery();
	if (!auth.isSignedIn) return <ErrorPages status={404} />;
	return (
		<Container>
			{isLoading ? (
				<Loading.Mesh />
			) : data && data.length > 0 ? (
				data.map(({ chatPartner, chatId, msg }) => {
					return (
						<ChatProfile
							key={chatId}
							chatPartner={chatPartner}
							userId={auth.user.id}
							chatId={chatId}
							lastMsg={msg}
						/>
					);
				})
			) : (
				<NoContent />
			)}
		</Container>
	);
};
const ChatProfile = ({
	chatId,
	userId,
	lastMsg,
	chatPartner,
}: {
	chatId: string;
	userId: string;
	lastMsg: ChatMSGType | undefined;
	chatPartner: AutherType;
}) => {
	type chatInfo = {
		count: number;
		lastMsg: ChatMSGType | undefined;
	};
	const [info, setInfo] = useState<chatInfo>({
		count: 0,
		lastMsg,
	});

	usePusher({
		key: `chatapp:${chatId}:${userId}`,
		event: `chatNotification`,
		cb: (msg: ChatMSGType) => {
			setInfo((prev) => {
				return { count: prev.count + 1, lastMsg: msg };
			});
		},
	});
	const lastMsgAuther = lastMsg?.autherId == chatPartner.id ? "" : "you :";
	return (
		<div className=" relative flex items-center p-2 gap-2 bg-revert-theme/10  h-24 w-full">
			<NextImage
				sizes="80px, 80px"
				className=" w-20 h-20 rounded-full overflow-hidden"
				src={chatPartner.profileImageUrl}
				alt={chatPartner.username}
			/>
			<NotificationDot count={info.count} />
			<div className=" flex-1">
				<h3>{chatPartner.username}</h3>
				<div>
					<p className=" truncate">
						{lastMsg && `${lastMsgAuther}${info.lastMsg?.content || ""}`}
					</p>
				</div>
			</div>
			<Link className=" absolute inset-0" href={`chatapp/${chatId}`} />
		</div>
	);
};
export default Chat;
