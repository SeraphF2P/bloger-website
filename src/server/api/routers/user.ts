import { clerkClient, type User } from "@clerk/nextjs/dist/api";
import { Post } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUser = (user: User) => {
  const userInfo = {
    id: user.id,
    gender: user.gender,
    firstName: user.firstName,
    lastName: user.lastName,
    username:
      user.username || `${user.firstName || "user"} ${user.lastName || ""}`,
    profileImageUrl: user.profileImageUrl ?? "/male-avatar.webp",
  };
  return userInfo;
};

export const userRouter = createTRPCRouter({
  getUserInfo: publicProcedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      const auther = await clerkClient.users.getUser(input);
      return filterUser(auther);
    }),
  getUserPosts: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const auther = await clerkClient.users.getUser(input);
      const posts: Post[] = await ctx.prisma.post.findMany({
        where: {
          autherId: input,
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const likes = await ctx.prisma.like.findMany({
        where: {
          autherId: input,
        },
      });
      return posts.map((post) => {
        const likedBy = likes.filter(({ postId }) => postId === post.id);
        // if (!auther)
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: "Post Auther Not Found",
        //   });
        return {
          post,
          auther,
          likedBy,
        };
      });
    }),
});
