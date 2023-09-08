import { toast } from "@/lib/myToast";
import { Btn } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

function ConfirmFriendRequestBtn({ autherId }: { autherId: string }) {
	const auth = useUser();
	const notify = api.notification.create.useMutation();
	const ConfirmFriendRequest = api.user.ConfirmFriendRequest.useMutation({
		onSuccess: () => {
			notify.mutate({
				to: autherId,
				from: auth.user?.id || "",
				type: "friendrequestconfirmed",
			});
		},
		onError: () => {
			toast({ message: "some thing went wrong", type: "error" });
		},
	});
	if (!auth.user || auth.user?.id == autherId) return null;
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
export default ConfirmFriendRequestBtn;
