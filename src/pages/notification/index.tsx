import { toast } from "@/lib/myToast";
import { Btn, Container, NextImage } from "@/ui";
import { type RouterOutputs, api } from "@/utils/api";
import { toggleValueByKey } from "@/utils/index";
import { useUser } from "@clerk/nextjs";
import type { NotificationType } from "@prisma/client";
import { type NextPage } from "next";
import { useState } from "react";

const Notification: NextPage = () => {
	const { data: notification, isLoading } = api.notification.get.useQuery();
	return (
		<Container className="gap-1">
			{notification?.map((note) => (
				<Alert key={note.id} {...note} />
			))}
		</Container>
	);
};
const Message = ({
	userName,
	type,
}: {
	userName: string;
	type: NotificationType;
}) => {
	const con = {
		friendrequest: `${userName} has send you a friend request`,
		friendrequestconfirmed: `${userName} accepted your friend request`,
		newlike: `${userName} liked your post`,
		newcomment: `${userName} commented on your post`,
	};
	return <>{con[type]}</>;
};
function AddFriend({ autherId }: { autherId: string }) {
	const auth = useUser();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const friendRequest = api.user.toggleFriend.useMutation({
		onMutate: () => {
			setIsConfirmed((prev) => !prev);
		},
		onError: () => {
			setIsConfirmed((prev) => !prev);
			toast({ message: "some thing went wrong", type: "error" });
		},
	});
	if (!auth.user || auth.user?.id == autherId) return null;
	return (
		<Btn
			disabled={friendRequest.isLoading}
			onClick={() => friendRequest.mutate(autherId)}
			className="px-4 py-2 "
		>
			{isConfirmed ? "accepted" : "confirm"}
		</Btn>
	);
}
const Alert = ({
	notifyFrom,
	type,
}: RouterOutputs["notification"]["get"][number]) => {
	return (
		<div className=" flex items-center p-2 shadow shadow-dynamic w-full h-24">
			<NextImage
				className=" w-20 h-20"
				src={notifyFrom.profileImageUrl}
				alt={notifyFrom.username}
			/>
			<div className=" flex-1  flex p-2    h-full">
				<Message userName={notifyFrom.username} type={type} />
				{type == "friendrequest" && <AddFriend autherId={notifyFrom.id} />}
			</div>
		</div>
	);
};
export default Notification;
