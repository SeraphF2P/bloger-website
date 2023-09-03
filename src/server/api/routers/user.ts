import { filterUser } from "@/utils/data-filters";
import { getInfiniteProfilePosts } from "@/utils/getInfinitePosts";
import { toggleValueByKey } from "@/utils/index";
import { clerkClient } from "@clerk/nextjs/server";
import type{ Friend } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const user = await clerkClient.users.getUser(userId);
      const friendList = await ctx.prisma.friend.findUnique({
        where: {
          userId,
        },
        select: {
          friends: true,
        },
      });
      const friends:Friend["friends"] = friendList?.friends || "[]" ;
      return {
        ...filterUser(user),
        friends :JSON.parse(friends) as {userId:string}[]|[],
      };
    }),
  getUserPosts: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        limit: z.number().min(1).optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input: { cursor, limit = 10, userId } }) => {
      return await getInfiniteProfilePosts({
        ctx,
        cursor,
        limit,
        whereClause: { autherId: userId },
      });
    }),
  getUserDrafts: privateProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.prisma.post.findMany({
      where: {
        autherId: ctx.userId,
        published: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return drafts || [];
  }),
  toggleFriend: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: autherId }) => {
      const userFriendTable = await ctx.prisma.friend.findUnique({
        where: {
          userId: ctx.userId,
        },
        select: {
          friends: true,
        },
      });
      const autherFriendTable = await ctx.prisma.friend.findUnique({
        where: {
          userId: autherId,
        },
        select: {
          friends: true,
        },
      });

      const usersfriends = JSON.parse(userFriendTable?.friends || "[]") as {userId:string}[]|[]
      const autherfriends = JSON.parse(autherFriendTable?.friends || "[]") as {userId:string}[]|[]

      const createFriendship = ctx.prisma.friend.upsert({
        where: {
          userId: ctx.userId,
        },
        create: {
          userId: ctx.userId,
          friends: JSON.stringify([{ userId: autherId }]),
        },
        update: {
          friends: JSON.stringify(toggleValueByKey<{userId:string}>( 
            usersfriends, 
            "userId",
            {userId:autherId} )),
        },
      });
      const createFriendshipBack = ctx.prisma.friend.upsert({
        where: {
          userId: autherId,
        },
        create: {
          userId: autherId,
          friends: JSON.stringify([{ userId: ctx.userId }]),
        },
        update: {
          friends: JSON.stringify(toggleValueByKey<{userId:string}>(
            autherfriends,
            "userId",
            {userId:ctx.userId},
          ),)
        },
      });
      await ctx.prisma.$transaction([createFriendship, createFriendshipBack]);
      void ctx.revalidate?.(`/profile/${ctx.userId}`);
      void ctx.revalidate?.(`/profile/${autherId}`);
    }),
});
