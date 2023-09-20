import { Modale, NextImage } from "@/ui";
import { UserProfile, useUser } from "@clerk/nextjs";

const UserProfilePage = () => {
	const auth = useUser();
	return (
		<Modale>
			<Modale.Btn variant="none">
				<NextImage
					className=" relative h-20 w-20 overflow-hidden rounded-full bg-green-400 "
					fill
					sizes="80px 80px"
					src={
						auth.isSignedIn ? auth.user.profileImageUrl : "/male-avatar.webp"
					}
					alt={`${auth.user?.username || ""} profile image`}
				/>
			</Modale.Btn>
			<Modale.Content asChild>
				<UserAcount />
			</Modale.Content>
		</Modale>
	);
};
const UserAcount = () => (
	<UserProfile
		appearance={{
			elements: {
				card: " w-full max-h-[calc(100dvh_-_80px)]",
			},
		}}
		path="/setting"
		routing="path"
	/>
);
export default UserProfilePage;
