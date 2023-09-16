import { usePusher } from "@/context/PusherContext";
import axiosClient from "@/lib/axiosClient";
import { cn } from "@/lib/cva";
import { Container, ContentInput, NextImage } from "@/ui";
import { api } from "@/utils/api";
import { fromChatId } from "@/utils/index";
import { ssgHelper } from "@/utils/ssgHelper";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion as m } from "framer-motion";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Error from "next/error";
import Image from "next/image";
import { type FC, useState } from "react";

const ChatPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
	chatId,
	user1,
	user2,
}) => {
	const auth = useUser();
	const chatPartnerId = user1 != auth.user?.id ? user1 : user2;

	const { data: chatPartnerProfile } =
		api.user.getUserProfile.useQuery(chatPartnerId);

	const { data: messages, isLoading } = useQuery({
		queryKey: [chatId],
		queryFn: async () => {
			return await axiosClient.get<ChatMSGType[] | []>(`chat?chatId=${chatId}`);
		},
		keepPreviousData: true,
	});
	const oldMessages = messages?.data ? [...messages.data] : [];

	const [allMessages, setAllMessages] = useState<ChatMSGType[]>(oldMessages);
	console.log(allMessages);
	const [lastMessageIds, setLastMessageIds] = useState<{
		user: string;
		chatPartner: string;
	}>({
		user:
			oldMessages.findLast((msg) => msg.autherId === auth.user?.id)?.id || "",
		chatPartner:
			oldMessages.findLast((msg) => msg.autherId === chatPartnerId)?.id || "",
	});

	const sendMessage = useMutation({
		mutationFn: async (val: string) => {
			return await axiosClient.post("chat", { content: val, chatId });
		},
		onError: (err) => {
			console.log(err);
		},
	});
	usePusher({
		key: `chat:${chatId}`,
		event: "resiveMessage",
		cb: (message: ChatMSGType) => {
			console.log(message);
			setAllMessages((prev) => [...prev, message]);
			setLastMessageIds((prev) => {
				if (message.autherId == auth.user?.id) {
					return {
						user: message.id,
						chatPartner: prev.chatPartner,
					};
				} else {
					return {
						user: prev.user,
						chatPartner: message.id,
					};
				}
			});
		},
	});

	if (!chatPartnerProfile) return <Error statusCode={400} withDarkMode />;
	if (!auth.user || !chatId.includes(auth.user.id))
		return <Error statusCode={401} withDarkMode />;
	return (
		<Container className="p-0 pt-[70px] pb-8 ">
			<section className="p-4 gap-2 flex-col-reverse  flex    overflow-y-scroll  remove-scroll-bar ">
				{allMessages &&
					!isLoading &&
					allMessages.reverse().map((msg) => {
						const isUser = auth.user.id == msg.autherId;
						const isLastMessage =
							lastMessageIds.user == msg.id ||
							lastMessageIds.chatPartner == msg.id;
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
									<m.div
										layoutId={
											(isUser ? auth.user.id : chatPartnerId) +
											"messageProfileBubble"
										}
										className={cn(
											" w-8 h-8 absolute z-10 rounded-full overflow-hidden",
											{
												"-top-10 -right-2 ": isUser,
												"-top-10 -left-2 ": !isUser,
											}
										)}
										layout="position"
									>
										<Image
											className=" absolute object-cover  "
											fill
											sizes="32px 32px"
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
			</section>

			<ContentInput
				isValidating={sendMessage.isLoading}
				mutate={(val) => sendMessage.mutate(val)}
			/>
		</Container>
	);
};

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};
export const getStaticProps = async (context: GetStaticPropsContext) => {
	const chatId = context.params?.chatId;
	if (typeof chatId != "string") {
		return {
			redirect: {
				destination: "/",
			},
		};
	}
	const [user1, user2] = fromChatId(chatId);
	const ssg = ssgHelper();
	await Promise.all([
		ssg.user.getUserProfile.prefetch(user1),
		ssg.user.getUserProfile.prefetch(user2),
	]);

	return {
		props: {
			chatId,
			user1,
			user2,
			trpcState: ssg.dehydrate(),
		},
	};
};
export default ChatPage;
