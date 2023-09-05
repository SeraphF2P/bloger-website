import { getInfinitePosts } from "../../../utils/getInfinitePosts";
import { postingRateLimit } from "@/utils/ratelimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input: { cursor, limit = 5 } }) => {
      return await getInfinitePosts({
        ctx,
        cursor,
        limit,
        whereClause: {
          published: true,
        },
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
      const drafts = await ctx.prisma.post.count({
        where: {
          autherId: ctx.userId,
        },
      });
      if (drafts > 4)
        throw new Error("Too many drafts emty some space then try again");
      await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          autherId: ctx.userId,
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
      void ctx.revalidate?.(`/profile/${ctx.userId}`);
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
    .input(z.object({
      autherId:z.string(),
      postId:z.string()
    }))
    .mutation(async ({ ctx, input:{autherId,postId} }) => {
      
      const isLiked = await ctx.prisma.like.findUnique({
        where: {
          postId_autherId: {
            autherId: ctx.userId,
            postId,
          },
        },
      });
      if (isLiked) {
        await ctx.prisma.like.delete({
          where: {
            postId_autherId: {
              autherId: ctx.userId,
              postId,
            },
          },
        });
      } else {
        await ctx.prisma.like.create({
          data: {
            autherId: ctx.userId,
            postId,
          },
        });
     if(autherId != ctx.userId) {
        await ctx.prisma.notification.create({
          data:{
            from:ctx.userId,
            to:autherId,
            onPost:postId,
            type:"newlike"
          }
        })
      }}
    }),
});
