import { api } from "../../utils/api";
import { Container, Modale, NextImage } from "@/ui";
import { type NextPage } from "next";
import Link from "next/link";

const index: NextPage = ({}) => {
	const getFriends = api.user.getFriends.useQuery();
	return (
		<Container>
			{getFriends.data &&
				getFriends.data.map((friend) => {
					return (
						<div
							key={friend.id}
							className=" relative flex items-center p-2 gap-2 bg-revert-theme/10  h-24 w-full"
						>
							<NextImage
								sizes="80px, 80px"
								className=" w-20 h-20 rounded-full overflow-hidden"
								src={friend.profileImageUrl}
								alt={friend.username}
							/>

							<div className=" flex-1">
								<h3>{friend.username}</h3>
							</div>
							<Link className=" absolute inset-0" href={"chat/" + friend.id} />
						</div>
					);
				})}
		</Container>
	);
};

// function FriendList({ friends }: { friends: AutherType[] }) {
// 	return (
// 		<Modale>
// 			<Modale.Btn variant="outline" className="  px-4 py-2 ">
// 				friends list
// 			</Modale.Btn>
// 			<Modale.Content className="translate-y-full p-2 [--fadein-duration:0.7s] z-50 relative bg-theme dark:bg-theme backdrop-blur-sm mn:max-w-screen-mn w-full shadow mx-4 h-full">
// 				{friends &&
// 					friends.map((friend) => {
// 						return (
// 							<div
// 								className=" flex p-2 rounded-sm bg-slate-50/10 backdrop-blur w-full gap-2 items-center "
// 								key={friend.id}
// 							>
// 								<NextImage
// 									className=" h-20 w-20"
// 									src={friend.profileImageUrl}
// 									alt={friend.username}
// 								/>
// 								<div>
// 									<h2>{friend.username}</h2>
// 								</div>
// 							</div>
// 						);
// 					})}
// 			</Modale.Content>
// 		</Modale>
// 	);
// }

export default index;
