import { variants } from "@/lib/cva";
import { Btn } from "@/ui";
import { SignIn, useUser } from "@clerk/nextjs";
import { useState } from "react";

const NotSignedIn = () => {
	const { isSignedIn } = useUser();
	const [open, setOpen] = useState(!isSignedIn);
	return (
		<>
			{open == true && isSignedIn == false && (
				<section className="fixed flex justify-center items-center flex-col   inset-0 z-50 bg-theme">
					<div className=" flex flex-col   items-center  gap-2">
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
							afterSignUpUrl={"/api/getUserName"}
						/>
						<Btn
							variant="outline"
							onClick={() => setOpen(false)}
							className=" px-4 py-2  capitalize "
						>
							continue as guest
						</Btn>
					</div>
				</section>
			)}
		</>
	);
};

export default NotSignedIn;
