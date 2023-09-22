import {
	ClerkSignIn,
	ThemeToggler,
	UserProfilePage,
} from "@/components/setting";
import { Container, Modale } from "@/ui";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

const Setting: NextPage = ({}) => {
	const auth = useUser();

	return (
		<Container>
			<h1 className=" w-full p-4 text-center">Setting</h1>
			<div className=" flex   w-full items-center justify-between  p-2">
				<div className=" text-xl">
					{!auth.isSignedIn && (
						<Modale>
							<Modale.Btn variant="none">sign in</Modale.Btn>
							<Modale.Content>
								<ClerkSignIn />
							</Modale.Content>
						</Modale>
					)}
					{auth.isSignedIn && <SignOutButton />}
				</div>
				<UserProfilePage />
			</div>
			<ThemeToggler />
		</Container>
	);
};

export default Setting;
