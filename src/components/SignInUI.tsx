import { variants } from "@/lib/cva";
import { Modale } from "@/ui";
import { SignIn } from "@clerk/nextjs";

const SignInUI = ({}) => {
  return (
    <Modale>
      <Modale.Btn variant="none">sign in</Modale.Btn>
      <Modale.Content>
        <SignIn
          appearance={{
            elements: {
              headerTitle: "text-revert-theme",
              headerSubtitle: "text-revert-theme",
              card: " max-w-xs w-full bg-gray-100 dark:bg-gray-700 ",
              footerActionText: "text-revert-theme",
              socialButtonsBlockButton: variants({ variant: "fill" }),
              socialButtons: "",
            },
          }}
        />
      </Modale.Content>
    </Modale>
  );
};
export default SignInUI;
