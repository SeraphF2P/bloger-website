import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { filterPostsWithOutAuther, filterUser } from "@/utils/data-filters";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input: userId }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (!clerkUser) throw new Error("User not found", { cause: 404 });
        return filterUser(clerkUser);
      }
      const isAuther = ctx.userId ? ctx.userId == userId : false;
      return {
        isAuther,
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
      const posts = await ctx.prisma.post.findMany({
        where: {
          autherId: userId,
          published: true,
        },
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ id: "desc" }, { createdAt: "desc" }],
        include: {
          likes: true,
          _count: { select: { likes: true, Comment: true } },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (nextItem != null) {
          nextCursor = {
            createdAt: nextItem.createdAt,
            id: nextItem.id,
          };
        }
      }
      console.log("nextCursor", nextCursor);
      const filteredPosts = filterPostsWithOutAuther(posts, userId);
      return {
        posts: filteredPosts,
        nextCursor,
      };
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

    return user?.posts;
  }),
});
