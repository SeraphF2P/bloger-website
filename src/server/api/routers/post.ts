import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

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
      user.username || `${user.firstName || "user"} ${user.lastName || ""}`,
    profileImageUrl: user.profileImageUrl ?? "/male-avatar.webp",
  };
  return userInfo;
};

const postingRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts: Post[] = await ctx.prisma.post.findMany({
      take: 10,
      where: { published: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.autherId),
        limit: 10,
      })
    ).map(filterUser);
    const likes = await ctx.prisma.likedBy.findMany();
    return posts.map((post) => {
      const auther = users.find((user) => user.id === post.autherId);

      const likedBy = likes.filter(({ postId }) => postId === post.id);
      if (!auther)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post Auther Not Found",
        });
      return {
        post,
        auther,
        likedBy,
      };
    });
  }),
  getUserPosts: privateProcedure.query(async ({ ctx }) => {
    const posts: Post[] = await ctx.prisma.post.findMany({
      where: {
        autherId: ctx.userId,
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const auther = await clerkClient.users.getUser(ctx.userId);
    if (!auther)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `User not found`,
      });
    const likes = await ctx.prisma.likedBy.findMany({
      where: {
        autherId: ctx.userId,
      },
    });
    return posts.map((post) => {
      const likedBy = likes.filter((item) => {
        return item.postId === post.id;
      });
      return { post, auther: filterUser(auther), likedBy };
    });
  }),
  createDraft: privateProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, "title field can't be emty")
          .max(30, "title cannot exceed 30 characters"),
        content: z
          .string()
          .min(1, "content field can't be emty")
          .max(500, "content cannot exceed 500 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await postingRateLimit.limit(ctx.userId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          autherId: ctx.userId,
        },
      });
    }),
  getUserDrafts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      where: {
        autherId: ctx.userId,
        published: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  publish: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.update({
        data: {
          published: true,
        },
        where: {
          id: input,
        },
      });
    }),
  delete: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
  like: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const liked = await ctx.prisma.likedBy.findFirst({
        where: {
          autherId: ctx.userId,
          postId: input,
        },
      });
      if (liked) {
        await ctx.prisma.likedBy.delete({
          where: {
            id: liked.id,
          },
        });
      } else {
        await ctx.prisma.likedBy.create({
          data: {
            autherId: ctx.userId,
            postId: input,
          },
        });
      }
    }),
});
