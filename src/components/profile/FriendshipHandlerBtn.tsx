import { variants } from "@/lib/cva";
import { toast } from "@/lib/myToast";
import { Btn } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface FriendshipHandlerBtnProps {
	autherId: string;
	userId: string;
	isSignedIn: boolean;
	isFriend: boolean;
	hasAfriendRequest: boolean;
}

const FriendshipHandlerBtn: FC<FriendshipHandlerBtnProps> = ({
	autherId,
	userId,
	isSignedIn,
	isFriend,
	hasAfriendRequest,
}) => {
	const isUserAuther = isSignedIn && autherId == userId;
	const status = isUserAuther
		? "isUserAuther"
		: isFriend
		? "isFriend"
		: hasAfriendRequest
		? "hasAfriendRequest"
		: "AddFriend";
	const config = {
		isUserAuther: null,
		isFriend: (
			<Link
				className={variants({
					variant: "fill",
					className: " capitalize px-4 py-2",
				})}
				href={`/chat/${[autherId, userId].sort().join("--")}`}
			>
				message
			</Link>
		),
		hasAfriendRequest: <ConfirmFriendRequestBtn autherId={autherId} />,
		AddFriend: <AddFriend isFriend={isFriend} autherId={autherId} />,
	};
	return config[status];
};
function ConfirmFriendRequestBtn({ autherId }: { autherId: string }) {
	const ctx = api.useContext();
	const optamisticConfirmFriendRequest = () => {
		void ctx.user.getUserProfile.setData(autherId, (oldData) => {
			if (!oldData) return;
			const { isFriend, ...rest } = oldData;
			return {
				isFriend: !isFriend,
				...rest,
			};
		});
	};
	const ConfirmFriendRequest = api.friend.ConfirmFriendRequest.useMutation({
		onMutate: optamisticConfirmFriendRequest,
		onError: () => {
			optamisticConfirmFriendRequest();
			toast({
				message: "some thing went wrong try again later",
				type: "error",
			});
		},
	});
	return (
		<Btn
			disabled={ConfirmFriendRequest.isLoading}
			onClick={() => ConfirmFriendRequest.mutate(autherId)}
			className="px-4 py-2 "
		>
			confirm
		</Btn>
	);
}
function AddFriend({ autherId }: { autherId: string; isFriend: boolean }) {
	const auth = useUser();
	const [isSent, setIsSent] = useState(false);
	const friendRequest = api.notification.create.useMutation({
		onMutate: () => {
			setIsSent((prev) => !prev);
		},
		onError: () => {
			setIsSent((prev) => !prev);
			toast({ message: "some thing went wrong", type: "error" });
		},
	});
	const deleteFriendRequest = api.notification.delete.useMutation({
		onMutate: () => {
			setIsSent((prev) => !prev);
		},
		onError: () => {
			setIsSent((prev) => !prev);
			toast({ message: "some thing went wrong", type: "error" });
		},
	});
	if (!auth.user || auth.user?.id == autherId) return null;
	return (
		<Btn
			disabled={friendRequest.isLoading}
			onClick={() => {
				if (isSent) {
					deleteFriendRequest.mutate({
						id: `${auth.user.id}-${autherId}`,
						from: auth.user.id,
						to: autherId,
						type: "friendrequest",
					});
				} else {
					friendRequest.mutate({
						from: auth.user.id,
						to: autherId,
						type: "friendrequest",
					});
				}
			}}
			className="px-4 py-2 "
		>
			{isSent ? "cancel request" : "send friend request"}
		</Btn>
	);
}
export default FriendshipHandlerBtn;
