import { cn } from "../../lib/cva";
import { api } from "../../utils/api";
import axiosClient from "@/lib/axiosClient";
import { Container, ContentInput, NextImage } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion as m } from "framer-motion";
import type { NextPage } from "next";
import Error from "next/error";
import { useRouter } from "next/router";

const ChatPage: NextPage = () => {
	const auth = useUser();
	const { asPath } = useRouter();
	const chatId = asPath.slice(6);
	// const [isConnected, setisConnected] = useState(false);
	// const [socket, setsocket] = useState();
	// useEffect(() => {
	// 	// if (process.env.Next_PUBLIC_SITE_URL == undefined)
	// 	// 	throw new Error("process.env.Next_PUBLIC_SITE_URL not found");

	// 	const socketInstance = new (ClientIO as any)(
	// 		process.env.Next_PUBLIC_SITE_URL,
	// 		{
	// 			path: "/api/chat/io",
	// 			addTrailingSlash: false,
	// 		}
	// 	);

	// 	socketInstance.on("connect", () => {
	// 		setisConnected(true);
	// 	});
	// 	socketInstance.on(`sendMessage:${chatId}`, (message: ChatMSGType) => {
	// 		console.log(message);
	// 	});
	// 	socketInstance.on("disconnect", () => {
	// 		setisConnected(false);
	// 	});

	// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	// 	setsocket(socketInstance);
	// 	return () => {
	// 		socketInstance.disconnect();
	// 	};
	// }, []);
	const { data: messages } = useQuery({
		// queryKey: ["messages"],
		queryFn: async () => {
			return await axiosClient.get<ChatMSGType[] | []>(`chat?chatId=${chatId}`);
		},
	});

	const sendMessage = useMutation({
		mutationFn: async (val: string) => {
			return await axiosClient.post("chat", { content: val, chatId });
		},
		onError: (err) => {
			console.log(err);
		},
	});
	const [user1, user2] = chatId.split("--");

	const chatPartner = user1 != auth.user?.id ? user1 : user2;
	const { data: chatPartnerProfile } =
		api.user.getUserProfile.useQuery(chatPartner);
	if (!chatPartnerProfile) return <Error statusCode={400} withDarkMode />;
	if (!auth.user || !chatId.includes(auth.user.id))
		return <Error statusCode={401} withDarkMode />;
	if (!messages?.data) return <>sadasda</>;
	const userLastMessageId =
		messages?.data.findLast((msg) => msg.autherId === auth.user.id)?.id || "";
	const chatPartnerLastMessageId =
		messages?.data.findLast((msg) => msg.autherId === chatPartner)?.id || "";
	const isConnected = false;
	return (
		<Container className="p-0 pt-[70px] pb-8 ">
			<div
				className={cn("w-full absolute z-20  top-[70px] p-2 ", {
					"  animate-fadein  bg-success": isConnected,
					"  animate-fadein  bg-alert": !isConnected,
				})}
			>
				{isConnected ? "connected" : "not"}
			</div>
			<section className="p-4 gap-2  flex flex-col   overflow-y-scroll  remove-scroll-bar ">
				{chatPartnerProfile && (
					<div className=" flex flex-col items-center gap-4  w-full h-60 relative ">
						<NextImage
							className={cn(" w-40 h-40 rounded-full overflow-hidden  ")}
							src={chatPartnerProfile.profileImageUrl}
							alt={chatPartnerProfile.username}
						/>
						<h2>{chatPartnerProfile.username}</h2>
					</div>
				)}
				{messages?.data &&
					messages.data.map((msg) => {
						const isUser = auth.user.id == msg.autherId;
						const isLastMessage =
							userLastMessageId == msg.id || chatPartnerLastMessageId == msg.id;
						return (
							<m.div
								className={cn(" relative px-4 py-2 rounded-full max-w-max", {
									"bg-primary self-end rounded-tr-none": isUser,
									"bg-primary/20 self-start rounded-tl-none": !isUser,
									"mt-10": isLastMessage,
								})}
								key={msg.id}
							>
								{isLastMessage && (
									<m.div layoutId={auth.user.id + "messageProfileBubble"}>
										<NextImage
											className={cn(
												" w-8 h-8 rounded-full overflow-hidden absolute ",
												{
													"-top-10 -right-2 ": isUser,
													"-top-10 -left-2 ": !isUser,
												}
											)}
											src={
												isUser
													? auth.user.profileImageUrl
													: chatPartnerProfile?.profileImageUrl
											}
											alt={
												isUser
													? auth.user.username || "user"
													: chatPartnerProfile?.profileImageUrl
											}
										/>
									</m.div>
								)}
								{msg.content}
							</m.div>
						);
					})}
			</section>

			<ContentInput
				isValidating={sendMessage.isLoading}
				mutate={(val) => sendMessage.mutate(val)}
			/>
		</Container>
	);
};

export default ChatPage;
