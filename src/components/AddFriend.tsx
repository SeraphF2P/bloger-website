import { toast } from "@/lib/myToast";
import { Btn } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

function AddFriend({ autherId }: { autherId: string; isFriend: boolean }) {
	const auth = useUser();
	const [isSent, setIsSent] = useState(false);
	const friendRequest = api.notification.createOrDelete.useMutation({
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
				friendRequest.mutate({
					from: auth.user.id,
					to: autherId,
					type: "friendrequest",
				});
			}}
			className="px-4 py-2 "
		>
			{isSent ? "cancel request" : "send friend request"}
		</Btn>
	);
}
export default AddFriend;
