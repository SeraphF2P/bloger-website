import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { filterUser } from "@/utils/data-filters";
import { getInfiniteProfilePosts } from "@/utils/getInfinitePosts";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const user = await clerkClient.users.getUser(userId);
      const friendList = await ctx.prisma.friend.findUnique({
        where: {
          userId,
        },
      });
      const friends = friendList?.friends as unknown as string[] | null;
      const isFriend = friends?.some((friend) => friend == userId) || false;
      return {
        ...filterUser(user),
        friends,
        isFriend,
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
        userId,
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

      const usersfriends = (userFriendTable?.friends || []) as string[] | [];
      const autherfriends = (autherFriendTable?.friends || []) as string[] | [];
      let addedFriend = false;
      function toggleFriend({
        friends,
        friendId,
      }: {
        friends: string[] | [];
        friendId: string;
      }) {
        let friendList;
        if (friends) {
          const index = friends.findIndex((f) => f == friendId);
          if (index != -1) {
            friendList = [
              ...friends.slice(0, index),
              ...friends.slice(index + 1),
            ];
            addedFriend = false;
          } else {
            friendList = [...friends, friendId];
            addedFriend = true;
          }
        }
        return friendList;
      }
      const createFriendship = ctx.prisma.friend.upsert({
        where: {
          userId: ctx.userId,
        },
        create: {
          userId: ctx.userId,
          friends: [autherId],
        },
        update: {
          friends: toggleFriend({ friends: usersfriends, friendId: autherId }),
        },
      });
      const createFriendshipBack = ctx.prisma.friend.upsert({
        where: {
          userId: autherId,
        },
        create: {
          userId: autherId,
          friends: [ctx.userId],
        },
        update: {
          friends: toggleFriend({
            friends: autherfriends,
            friendId: ctx.userId,
          }),
        },
      });
      await ctx.prisma.$transaction([createFriendship, createFriendshipBack]);
      void ctx.revalidate?.(`/profile/${ctx.userId}`);
      void ctx.revalidate?.(`/profile/${autherId}`);
      return {
        addedFriend,
      };
    }),
});
