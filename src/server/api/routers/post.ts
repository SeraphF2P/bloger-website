import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUser = (user: User) => {
  const userInfo = {
    id: user.id,
    gender: user.gender,
    firstName: user.firstName,
    lastName: user.lastName,
    username:
      user.username ?? `${user.firstName || "user"} ${user.lastName || ""}`,
    profileImageUrl:
      user.profileImageUrl == undefined ?? user.gender == "male"
        ? "/male-avatar.webp"
        : "/female-avatar.webp",
  };
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
  getUserPosts: privateProcedure.query(async ({ ctx }) => {
    const posts: Post[] = await ctx.prisma.post.findMany({
      where: {
        autherId: ctx.userId,
        published: true,
      },
    });
    const auther = await clerkClient.users.getUser(ctx.userId);
    if (!auther)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `User not found`,
      });
    return { posts, auther: filterUser(auther) };
  }),
  createDraft: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(12),
        content: z.string().min(1).max(255),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          autherId: ctx.userId,
          published: input.published || false,
        },
      });
    }),
  getUserDrafts: privateProcedure.query(async ({ ctx }) => {
    const posts: Post[] | null = await ctx.prisma.post.findMany({
      where: {
        autherId: ctx.userId,
        published: false,
      },
    });
    const auther = await clerkClient.users.getUser(ctx.userId);
    console.log(posts);
    if (!auther)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `User not found`,
      });
    return { posts, auther: filterUser(auther) };
  }),
});
