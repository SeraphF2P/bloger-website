import { api } from "../../utils/api";
import { SignInUI } from "@/components/index";
import { ThemeToggler } from "@/components/setting";
import { Container, ContentInput, NextImage } from "@/ui";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

const Setting: NextPage = ({}) => {
	const { user, isSignedIn } = useUser();
	const { mutate } = api.user.update.useMutation();
	return (
		<Container>
			<h1 className=" w-full p-4 text-center">Setting</h1>
			<div className=" flex   w-full items-center justify-between  p-2">
				<div className=" text-xl">
					{!isSignedIn && <SignInUI />}
					{isSignedIn && <SignOutButton />}
				</div>
				<NextImage
					className=" relative h-20 w-20 overflow-hidden rounded-full bg-green-400 "
					fill
					sizes="80px 80px"
					src={isSignedIn ? user.profileImageUrl : "/male-avatar.webp"}
					alt={`${user?.username || ""} profile image`}
				/>
			</div>
			{/* <ContentInput isValidating={false} mutate={mutate} /> */}
			<ThemeToggler />
		</Container>
	);
};

export default Setting;
