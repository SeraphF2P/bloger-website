import { filterUser } from "@/utils/data-filters";
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
  getUserPosts: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const auther = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input,
        },
        include: {
          posts: {
            where: {
              autherId: input,
              published: true,
            },
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
          },
        },
      });

      const posts = auther.posts.map((post) => {
        const isLiked = post.likes.some((like) => like.autherId == ctx.userId);
        return {
          post,
          auther: filterUser(post.auther),
          likesCount: post._count.likes,
          isLiked,
        };
      });
      return {
        auther: filterUser(auther),
        posts,
      };
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
      // throw new Error("afa ")
      const isLiked = await ctx.prisma.like.findUnique({
        where: {
          postId_autherId: {
            autherId: ctx.userId,
            postId: input,
          },
        },
      });
      if (isLiked) {
        await ctx.prisma.like.delete({
          where: {
            postId_autherId: {
              autherId: ctx.userId,
              postId: input,
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
