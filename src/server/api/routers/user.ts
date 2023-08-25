import { createTRPCRouter, publicProcedure } from "../trpc";
import clerkClient from "@clerk/clerk-sdk-node";

export const userRouter = createTRPCRouter({
  getUsersIds: publicProcedure.query(async () => {
    const users = await clerkClient.users.getUserList();

    return users.map((user) => user.id);
  }),
});
