import axiosClient from "@/lib/axiosClient";
import { Container, ContentInput } from "@/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const ChatPage: NextPage = () => {
	// const auth = useUser();
	const { asPath } = useRouter();
	const chatId = asPath.slice(6);

	const sendMessageHandler = async (val: string) => {
		return await axiosClient.post("chat", { content: val, chatId });
	};
	const getMessageHandler = async () => {
		return await axiosClient.get<ChatMSGType[] | []>(`chat?chatId=${chatId}`);
	};
	const { data: messages } = useQuery({
		queryFn: getMessageHandler,
	});
	const sendMessage = useMutation({
		mutationFn: sendMessageHandler,
		onError: (err) => {
			console.log(err);
		},
	});

	// if (![user1, user2].includes(auth.user?.id || "")) return null;
	return (
		<Container>
			{messages?.data &&
				messages.data.map((msg) => {
					return (
						<div className="p8 bg-red-500" key={msg.id}>
							{msg.content}
						</div>
					);
				})}
			<ContentInput
				isValidating={sendMessage.isLoading}
				mutate={(val) => sendMessage.mutate(val)}
			/>
		</Container>
	);
};

export default ChatPage;
