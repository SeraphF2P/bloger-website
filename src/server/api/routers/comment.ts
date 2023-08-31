import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { filterUser } from "@/utils/data-filters";
import { postingRateLimit } from "@/utils/ratelimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input: { cursor, limit = 5, postId } }) => {
      const data = await ctx.prisma.comment.findMany({
        take: limit + 1,
        where: {
          postId,
        },
        cursor: cursor
          ? { id: cursor.id, createdAt: cursor.createdAt }
          : undefined,
        orderBy: [{ id: "desc" }, { createdAt: "desc" }],
        include: {
          auther: true,
        },
      });
      let nextCursor;
      if (data.length > limit) {
        const lastCursor = data.pop();
        if (lastCursor != null) {
          nextCursor = {
            id: lastCursor.id,
            createdAt: lastCursor.createdAt,
          };
        }
      }

      const comments = data.map((comment) => {
        return {
          id: comment.id,
          content: comment.content,
          auther: filterUser(comment.auther),
        };
      });

      return {
        comments,
        nextCursor,
      };
    }),
  createComment: privateProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        content: z
          .string()
          .min(1, "content field can't be emty")
          .max(500, "content cannot exceed 500 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await postingRateLimit.limit(ctx.userId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.prisma.comment.create({
        data: {
          autherId: ctx.userId,
          postId: input.postId,
          content: input.content,
        },
      });
    }),
});
