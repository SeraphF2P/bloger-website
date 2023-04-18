import { type FC } from "react";
import { Container, ThemeToggler } from "@/components";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

interface settingProps {}

const setting: FC<settingProps> = ({}) => {
  const { user, isSignedIn } = useUser();

  return (
    <Container>
      <h1 className=" w-full p-4 text-center capitalize">setting</h1>
      <div className=" flex h-20 w-full items-center justify-between  px-2">
        <div className=" text-xl">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && <SignOutButton />}
        </div>
        <div className=" relative bg-green-400 ">
          <img
            className=" absolute inset-0"
            src={user?.profileImageUrl}
            alt={`${user?.username} profile image`}
          />
        </div>
      </div>
      <ThemeToggler />
    </Container>
  );
};

export default setting;
