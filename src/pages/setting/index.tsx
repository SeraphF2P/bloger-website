import Modale from "../../components/ui/Modale";
import { variants } from "../../lib/cva";
import { ThemeToggler } from "@/components/setting";
import { Loading } from "@/ui";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";

const Setting: NextPage = ({}) => {
  const { user, isSignedIn, isLoaded } = useUser();

  return (
    <>
      <h1 className=" w-full p-4 text-center">Setting</h1>
      <div className=" flex  w-full items-center justify-between  p-2">
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
          {!isLoaded && <Loading as="component" />}
        </div>
      </div>
      <ThemeToggler />
    </>
  );
};
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
              card: "bg-gray-700 ",
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
export default Setting;
