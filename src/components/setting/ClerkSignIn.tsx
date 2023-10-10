import { variants } from "@/lib/cva";
import { SignIn } from "@clerk/nextjs";

const ClerkSignIn = () => {
	return (
		<SignIn
			appearance={{
				variables: { colorPrimary: "rgb(139,92,246)" },
				elements: {
					headerTitle: "text-revert-theme",
					headerSubtitle: "text-revert-theme",
					card: "w-[320px] bg-card ",
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
			afterSignInUrl={"/home"}
			afterSignUpUrl={"/home"}
		/>
	);
};

export default ClerkSignIn;
