import { SignInUI } from "@/components/index";
import { ThemeToggler } from "@/components/setting";
import { Container } from "@/ui";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";

const Setting: NextPage = ({}) => {
	const { user, isSignedIn } = useUser();

	return (
		<Container>
			<h1 className=" w-full p-4 text-center">Setting</h1>
			<div className=" flex   w-full items-center justify-between  p-2">
				<div className=" text-xl">
					{!isSignedIn && <SignInUI />}
					{isSignedIn && <SignOutButton />}
				</div>
				<div className=" relative h-20 w-20 overflow-hidden rounded-full bg-green-400 ">
					<Image
						fill
						className=" absolute inset-0"
						src={isSignedIn ? user.profileImageUrl : "/male-avatar.webp"}
						alt={`${user?.username || ""} profile image`}
					/>
				</div>
			</div>
			<ThemeToggler />
		</Container>
	);
};

export default Setting;
