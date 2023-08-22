import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUser = (
  user:
    | User
    | {
        id: string;
        gender: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        profileImageUrl: string | null;
      }
) => {
  const { gender, id, firstName, lastName, profileImageUrl, username } = user;
  const userInfo = {
    id: id,
    gender: gender,
    firstName: firstName,
    lastName: lastName,
    username: username || `${firstName || "user"} ${lastName || ""}`,
    profileImageUrl: profileImageUrl ?? "/male-avatar.webp",
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
    const posts = await ctx.prisma.post.findMany({
      take: 10,
      where: { published: true },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: true,
        _count: { select: { likes: true } },
        auther: {
          select: {
            id: true,
            gender: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImageUrl: true,
          },
        },
      },
    });
    return posts.map((post) => {
      const isLiked = post.likes.some((like) => like.autherId == ctx.userId);
      return {
        post,
        auther: filterUser(post.auther),
        likesCount: post._count.likes,
        isLiked,
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
    const likes = await ctx.prisma.like.findMany({
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
      const auther = filterUser(await clerkClient.users.getUser(ctx.userId));
      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          auther: {
            connectOrCreate: {
              where: {
                id: ctx.userId,
              },
              create: auther,
            },
          },
        },
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

    return user?.posts;
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
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
      });
      if (post?.autherId !== ctx.userId)
        return new TRPCError({ code: "UNAUTHORIZED" });
      await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
  like: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const liked = await ctx.prisma.like.findFirst({
        where: {
          autherId: ctx.userId,
          postId: input,
        },
      });
      if (liked) {
        await ctx.prisma.like.delete({
          where: {
            postId_autherId: {
              autherId: liked.autherId,
              postId: liked.postId,
            },
          },
        });
      } else {
        await ctx.prisma.like.create({
          data: {
            autherId: ctx.userId,
            postId: input,
          },
        });
      }
    }),
});
