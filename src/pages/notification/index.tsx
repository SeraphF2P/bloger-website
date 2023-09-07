import { Container, Icons, NextImage } from "@/ui";
import { api, type RouterOutputs } from "@/utils/api";
import { type NextPage } from "next";
import Link from "next/link";

const Notification: NextPage = () => {
	const ctx = api.useContext();
	const { data: notification } = api.notification.get.useQuery(undefined, {
		onSuccess: () => {
			void ctx.notification.count.setData(undefined, 0);
		},
	});

	return (
		<Container className="gap-1">
			{notification?.map((note) => (
				<Alert key={note.id} {...note} />
			))}
		</Container>
	);
};
const Message = ({ userName, type }: { userName: string; type: NoteType }) => {
	const con = {
		friendrequest: `${userName} has send you a friend request`,
		friendrequestconfirmed: `${userName} accepted your friend request`,
		newlike: `${userName} liked your post`,
		newcomment: `${userName} commented on your post`,
	};
	return <>{con[type]}</>;
};

const Alert = ({
	type,
	notifyFrom,
}: RouterOutputs["notification"]["get"][number]) => {
	return (
		<div className="cursor-default  flex items-center p-2 border-revert-theme/70 border w-full h-24">
			<div className=" relative">
				<NextImage
					className=" w-20 h-20"
					src={notifyFrom.profileImageUrl}
					alt={notifyFrom.username}
				/>
				<Link
					className=" absolute inset-0"
					href={"/profile/" + notifyFrom.id}
				/>
			</div>
			<div className=" flex-1  flex p-2    h-full">
				<Message userName={notifyFrom.username} type={type} />
			</div>
			<div className="  rounded-sm flex justify-center items-center p-2">
				<Icons.NotificationIcons
					className=" fill-primary w-12 h-12"
					type={type}
				/>
			</div>
		</div>
	);
};
export default Notification;
