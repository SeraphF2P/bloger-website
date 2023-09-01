import { getInfiniteProfilePosts } from "../../../utils/getInfinitePosts";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { filterUser } from "@/utils/data-filters";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          friends: true,
        },
      });
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (!clerkUser) throw new Error("User not found", { cause: 404 });
        return {
          ...filterUser(clerkUser),
        };
      }

      return {
        ...filterUser(user),
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
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
      select: {
        posts: {
          where: {
            published: false,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return user?.posts || [];
  }),
  toggleFriend: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: friendId }) => {
      const existingFriend = await ctx.prisma.user.findFirst({
        where: {
          id: friendId,
          friends: { some: { id: ctx.userId } },
        },
      });
      let addedFriend;
      if (existingFriend == null) {
        await ctx.prisma.user.update({
          where: {
            id: friendId,
          },
          data: {
            friends: { connect: { id: ctx.userId } },
          },
        });
        addedFriend = true;
      } else {
        await ctx.prisma.user.update({
          where: {
            id: ctx.userId,
          },
          data: {
            friends: { disconnect: { id: friendId } },
          },
        });
        addedFriend = false;
      }
      return {
        addedFriend,
      };
    }),
});
