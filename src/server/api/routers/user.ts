import { useUser } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getSignedUser: publicProcedure.query(() => {
    
    const { user, isLoaded, isSignedIn } = useUser();
    if (isSignedIn)
      return {
        isLoaded,
        isSignedIn,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username:
          user.username ?? `${user.firstName || "user"} ${user.lastName || ""}`,
        profileImageUrl: "/male-avatar.webp",
      };
  }),
});
