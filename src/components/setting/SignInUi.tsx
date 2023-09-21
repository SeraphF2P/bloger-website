import { variants } from "@/lib/cva";
import { Modale } from "@/ui";
import { SignIn } from "@clerk/nextjs";

const SignInUi = ({}) => {
	return (
		<Modale>
			<Modale.Btn variant="none">sign in</Modale.Btn>
			<Modale.Content className="">
				<SignIn
					appearance={{
						variables: { colorPrimary: "rgb(139,92,246)" },
						elements: {
							headerTitle: "text-revert-theme",
							headerSubtitle: "text-revert-theme",
							card: "w-[320px] bg-gray-100 dark:bg-gray-700 ",
							footerActionText: "text-revert-theme",
							socialButtonsIconButton: variants({
								variant: "outline",
								className: "bg-primary/30",
							}),
							formFieldLabel: "text-revert-theme",
							formFieldRow__identifier: "text-revert-theme",
							dividerLine: " bg-revert-theme",
							dividerText: "text-revert-theme",
						},
					}}
				/>
			</Modale.Content>
		</Modale>
	);
};
export default SignInUi;
