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
        <section className="fixed flex justify-center items-center  inset-0 z-50 bg-theme">
          <div className=" flex flex-col h-[382px] max-w-xs w-full items-center gap-2">
            <SignIn
              appearance={{
                elements: {
                  headerTitle: "text-revert-theme",
                  headerSubtitle: "text-revert-theme",
                  card: " max-w-xs w-full bg-gray-100 dark:bg-gray-700 ",
                  footerActionText: "text-revert-theme",
                  socialButtonsBlockButton: variants({ variant: "fill" }),
                  socialButtons: "",
                  avatarImage: "/male-avatar.webp",
                },
              }}
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
