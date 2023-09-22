import { variants } from "../../lib/cva";
import AddFriend from "./AddFriend";
import ConfirmFriendRequestBtn from "./ConfirmFriendRequestBtn";
import Link from "next/link";
import type { FC } from "react";

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

export default FriendshipHandlerBtn;
