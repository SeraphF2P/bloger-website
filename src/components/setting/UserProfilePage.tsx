import { Icons, Modale, NextImage } from "@/ui";
import { UserProfile, useUser } from "@clerk/nextjs";

const UserProfilePage = () => {
	const auth = useUser();
	return (
		<Modale>
			<Modale.Btn
				className=" h-20 w-20 border-[0.5px] border-revert-theme overflow-hidden rounded-full bg-primary"
				variant="none"
			>
				<NextImage
					className=" relative w-full h-full "
					sizes="80px 80px"
					src={
						auth.isSignedIn ? auth.user.profileImageUrl : "/male-avatar.webp"
					}
					alt={`${auth.user?.username || ""} profile image`}
				/>
				<div className=" hover:animate-buzz hover:bg-theme/80 transition-colors duration-500 absolute bg-theme/60 p-4 inset-0">
					<Icons.gear />
				</div>
			</Modale.Btn>
			<Modale.Content>
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
		routing="virtual"
	/>
);
export default UserProfilePage;
