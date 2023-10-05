import { ScrollEndIndecator } from "../../components";
import { usePusher } from "@/context/PusherContext";
import { cn } from "@/lib/cva";
import { Container, ContentInput, ErrorPages, Icons, NextImage } from "@/ui";
import { api } from "@/utils/api";
import { fromChatId } from "@/utils/index";
import { ssgHelper } from "@/utils/ssgHelper";
import { useUser } from "@clerk/nextjs";
import { motion as m } from "framer-motion";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useState, type FC } from "react";

const ChatPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
	chatId,
	user1,
	user2,
}) => {
	const auth = useUser();
	const chatPartnerId = user1 != auth.user?.id ? user1 : user2;
	const ctx = api.useContext();
	const { data: chatPartnerProfile } =
		api.user.getUserProfile.useQuery(chatPartnerId);

	const { data, fetchNextPage, isFetchingNextPage } =
		api.chat.getChatMsgs.useInfiniteQuery(
			{ chatId },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);
	const oldMessages =
		data?.pages.flatMap((page) => [...page.msgs].reverse()) || [];
	const lastMsgsIds = data?.pages[0]?.lastMsgsIds || {
		user: "",
		chatPartner: "",
	};
	const hasNextPage = data?.pages.at(-1)?.hasNextPage;
	const { mutate: setIsTyping } = api.chat.changeTypingState.useMutation();
	const { mutate: sendMessage, isLoading: isSending } =
		api.chat.sendMsg.useMutation({
			onError: (error) => {
				console.error(error);
			},
		});
	const updateMsgs = ({
		message,
		chatPartnerId,
		userId,
	}: {
		message: ChatMSGType;
		userId: string;
		chatPartnerId: string;
	}) => {
		void ctx.chat.getChatMsgs.setInfiniteData({ chatId }, (oldData) => {
			if (!oldData) return;
			const lastPage = oldData.pages.pop() || {
				hasNextPage: false,
				nextCursor: 0,
				msgs: [],
				lastMsgsIds: {
					user: "",
					chatPartner: "",
				},
			};
			return {
				pageParams: oldData.pageParams,
				pages: [
					...oldData.pages,
					{
						hasNextPage: lastPage.hasNextPage,
						nextCursor: lastPage.nextCursor,
						msgs: [...lastPage.msgs, message],
						lastMsgsIds: {
							user: message.autherId == userId ? message.id : lastMsgsIds.user,
							chatPartner:
								message.autherId == chatPartnerId
									? message.id
									: lastMsgsIds.chatPartner,
						},
					},
				],
			};
		});
	};

	usePusher({
		key: `chatapp:${chatId}`,
		event: "resiveMessage",
		cb: (message: ChatMSGType) => {
			updateMsgs({ message, chatPartnerId, userId: auth.user?.id || "" });
		},
	});

	if (!auth.user || !chatId.includes(auth.user.id))
		return <ErrorPages status={401} />;
	return (
		<Container className="relative p-0 pt-[70px] pb-8 ">
			<section className="    p-4 pb-8 gap-2 flex-col-reverse flex    overflow-y-scroll  remove-scroll-bar ">
				<TypingIndicator userId={auth.user.id} chatId={chatId} />
				{oldMessages &&
					oldMessages.map((msg) => {
						const isUser = auth.user.id == msg.autherId;
						const isLastMessage =
							lastMsgsIds.user == msg.id || lastMsgsIds.chatPartner == msg.id;
						return (
							<m.div
								className={cn(" relative px-4 py-2 rounded-full max-w-max", {
									"bg-primary self-end rounded-tr-none": isUser,
									"bg-primary/20 self-start rounded-tl-none": !isUser,
									"mt-10": isLastMessage,
								})}
								key={msg.id}
							>
								{isLastMessage ? (
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
													: chatPartnerProfile?.profileImageUrl || ""
											}
											alt={
												isUser
													? auth.user.username || "user"
													: chatPartnerProfile?.profileImageUrl || ""
											}
										/>
									</m.div>
								) : null}
								{msg.content}
							</m.div>
						);
					})}
				{chatPartnerProfile ? (
					<div className=" flex flex-col items-center gap-4  w-full h-60 relative ">
						<NextImage
							className={cn(" w-40 h-40 rounded-full overflow-hidden  ")}
							src={chatPartnerProfile.profileImageUrl}
							alt={chatPartnerProfile.username}
						/>
						<h2>{chatPartnerProfile.username}</h2>
					</div>
				) : null}
				{hasNextPage && (
					<ScrollEndIndecator
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage || false}
						className="w-full flex justify-center items-center p-1 rounded-sm bg-revert-theme text-theme "
					>
						<Icons.refresh
							data-loading={isFetchingNextPage}
							className=" data-[loading=true]:animate-spin  h-8 w-8"
						/>
					</ScrollEndIndecator>
				)}
			</section>
			<ContentInput
				isValidating={isSending}
				placeholder="write a message..."
				mutate={(val) => sendMessage({ content: val, chatId })}
				className="absolute bottom-0 left-0  h-12  w-full "
				onHasValue={(hasValue) => {
					setIsTyping({ chatId, chatPartnerId, isTyping: hasValue });
				}}
			/>
		</Container>
	);
};

const TypingIndicator = ({
	chatId,
	userId,
}: {
	chatId: string;
	userId: string;
}) => {
	const [isTyping, setisTyping] = useState(false);
	usePusher({
		key: `chatapp:${chatId}:${userId}`,
		event: "isTyping",
		cb: (val: boolean) => {
			setisTyping(val);
		},
	});
	if (!isTyping) return null;
	return (
		<div
			className={cn(
				"dark:bg-gray-400 bg-gray-600 p-2 self-start rounded-bl-none rounded-full max-w-min flex gap-1"
			)}
		>
			<span className=" animate-[bounce_1s_infinite] relative top-0.5      bg-gray-400 dark:bg-gray-600 rounded-full h-4  w-4" />
			<span className=" animate-[bounce_1s_infinite_0.2s] relative top-0.5 bg-gray-400 dark:bg-gray-600 rounded-full h-4  w-4" />
			<span className=" animate-[bounce_1s_infinite_0.4s] relative top-0.5 bg-gray-400 dark:bg-gray-600 rounded-full h-4  w-4" />
		</div>
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
		ssg.chat.getChatMsgs.prefetchInfinite({ chatId }),
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
