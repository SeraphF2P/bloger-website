import { NoContent } from "../../components";
import { Container, Icons, Loading, NextImage } from "@/ui";
import { api, type RouterOutputs } from "@/utils/api";
import { AnimatePresence, type Variants, motion as m } from "framer-motion";
import { type NextPage } from "next";
import Link from "next/link";

const Notification: NextPage = () => {
	const ctx = api.useContext();
	const { data: notifications, isLoading } = api.notification.getAll.useQuery(
		undefined,
		{
			onSuccess: () => {
				void ctx.notification.count.setData(undefined, 0);
			},
		}
	);

	return (
		<Container layout className="gap-1">
			{isLoading ? (
				<Loading.Mesh />
			) : (
				<AnimatePresence>
					{notifications && notifications.length > 0 ? (
						notifications.map((note) => <Alert key={note.id} {...note} />)
					) : (
						<NoContent />
					)}
				</AnimatePresence>
			)}
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
const slideInAnimation: Variants = {
	initial: { y: "-100%", opacity: 0.2 },
	animate: { y: 0, opacity: 1 },
	exit: { y: "-100%", opacity: 0.2 },
};
const Alert = ({
	type,
	notifyFrom,
}: RouterOutputs["notification"]["getAll"][number]) => {
	return (
		<m.div
			variants={slideInAnimation}
			initial="initial"
			animate="animate"
			exit="exit"
			layout="position"
			className="cursor-default  flex items-center p-2 border-revert-theme/70 border w-full h-24"
		>
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
		</m.div>
	);
};
export default Notification;
