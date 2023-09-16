import { filterUser } from "@/utils/data-filters";
import { getInfiniteProfilePosts } from "@/utils/getInfinitePosts";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: autherId }) => {
      const user = await clerkClient.users.getUser(autherId);
      if(ctx.userId == null) return {
        ...filterUser(user),
        friends:[], 
        isFriend:false,
        hasAfriendRequest:false
      };


    const [friendList,hasAfriendRequest] = await Promise.all([
         ctx.redis.lrange(`friendship:${autherId}`,0,-1),
         ctx.redis.note.findMany({to:ctx.userId,type:"friendrequest"})
    ])

      const friends = friendList ? await clerkClient.users.getUserList({
        userId:friendList
      }):[]
        return {
          ...filterUser(user),
          friends:friends.map(f=>filterUser(f)), 
          isFriend:friendList.some(f=>f == ctx.userId),
          hasAfriendRequest:hasAfriendRequest.length > 0
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


})