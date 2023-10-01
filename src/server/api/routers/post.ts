import { getInfinitePosts } from "@/utils/getInfinitePosts";
import { postingRateLimit } from "@/utils/ratelimit";
import { TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
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
        limit
      });
    }),
 
  publish: privateProcedure
    .input(z.object({
      title:z.string().min(3),
      content:z.string().min(3)
    }))
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
         let success
         if (isLiked) {
         const deletedLike =   await ctx.prisma.like.delete({
             where: {
               postId_autherId: {
                 autherId: ctx.userId,
                 postId,
               },
             },
           });
           success = !!deletedLike
         } else {
          const userIsNotAuther = autherId != ctx.userId && !isLiked
          const result =await Promise.allSettled([
         await ctx.prisma.like.create({
             data: {
               autherId: ctx.userId,
               postId,
             },
           }),
          ...(userIsNotAuther?[await ctx.redis.note.create({
          from:ctx.userId,
          to:autherId,
          type:"newlike",
          onPost:postId
          })]:[])
          ])
           success = result.every(res=>res.status == "fulfilled")
         }
         return success
  }
    ),
});
