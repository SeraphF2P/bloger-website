import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { filterUser } from "@/utils/data-filters";
import { postingRateLimit } from "@/utils/ratelimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        take: 10,
        where: {
          postId: input,
        },
        include: {
          auther: true,
        },
      });

      return comments.map((comment) => {
        return {
          id: comment.id,
          content: comment.content,
          auther: filterUser(comment.auther),
        };
      });
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
