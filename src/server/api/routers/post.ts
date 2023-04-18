import { useUser } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUser = (user: User) => {
  const userInfo = {
    id: user.id,
    gender: user.gender,
    firstName: user.firstName,
    lastName: user.lastName,
    username:
      user.username ?? `${user.firstName || "user"} ${user.lastName || ""}`,
    profileImageUrl:
      user.profileImageUrl == undefined ? user.gender == "male" ? "/male-avatar.webp": "/female-avatar.webp"
  } ;
  return userInfo;
};
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 10 });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.autherId),
        limit: 10,
      })
    ).map(filterUser);
    return posts.map((post) => {
      const auther = users.find((user) => user.id === post.autherId);
      if (!auther)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post Auther Not Found",
        });
      return {
        post,
        auther,
      };
    });
  }),
});
