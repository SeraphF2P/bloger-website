import { filterUser } from "@/utils/data-filters";
import { getInfiniteProfilePosts } from "@/utils/getInfinitePosts";
import { toggleValueByKey } from "@/utils/index";
import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { Friend } from "@prisma/client";
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
        hasAfriendRequest:false
      };

      const friendList = await ctx.prisma.friend.findUnique({
        where: {
          userId:autherId
        },
        select: {
          friends: true,
        },
      });

      
      const hasAfriendRequest = await ctx.redis.note.findMany({to:ctx.userId,type:"friendrequest"})
    
      const friendsJson:Friend["friends"] = friendList?.friends || "[]" ;

      const friendsArray =JSON.parse(friendsJson) as {userId:string}[]|[]
      let friends:User[] = [];
      if(friendsArray != null && friendsArray.length > 0){
         friends = await clerkClient.users.getUserList({
        userId:friendsArray.map(f=>f.userId)
      })
      }
      return {
        ...filterUser(user),
        friends:friends.map(f=>filterUser(f)), 
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

  ConfirmFriendRequest: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: autherId }) => {
      const userFriendTable = await ctx.prisma.friend.findUnique({
        where: {
          userId: ctx.userId,
        },
        select: {
          friends: true,
        },
      });
      const autherFriendTable = await ctx.prisma.friend.findUnique({
        where: {
          userId: autherId,
        },
        select: {
          friends: true,
        },
      });

      const usersfriends = JSON.parse(userFriendTable?.friends || "[]") as {userId:string}[]|[]
      const autherfriends = JSON.parse(autherFriendTable?.friends || "[]") as {userId:string}[]|[]

      const createFriendship = ctx.prisma.friend.upsert({
        where: {
          userId: ctx.userId,
        },
        create: {
          userId: ctx.userId,
          friends: JSON.stringify([{ userId: autherId }]),
        },
        update: {
          friends: JSON.stringify(toggleValueByKey<{userId:string}>( 
            usersfriends, 
            "userId",
            {userId:autherId} )),
        },
      });
      const createFriendshipBack = ctx.prisma.friend.upsert({
        where: {
          userId: autherId,
        },
        create: {
          userId: autherId,
          friends: JSON.stringify([{ userId: ctx.userId }]),
        },
        update: {
          friends: JSON.stringify(toggleValueByKey<{userId:string}>(
            autherfriends,
            "userId",
            {userId:ctx.userId},
          ),)
        },
      });
      const notify = ctx.prisma.notification.create({
        data:{
          from:ctx.userId,
          to:autherId,
          type:"friendrequestconfirmed",
        }
      })
      
      await ctx.prisma.$transaction([createFriendship,createFriendshipBack,notify])

      void ctx.revalidate?.(`/profile/${ctx.userId}`);
      void ctx.revalidate?.(`/profile/${autherId}`);
    }),
  getFriends: privateProcedure
    .query(async ({ ctx }) => {
      const userFriendTable = (await ctx.prisma.friend.findUnique({
        where: {
          userId: ctx.userId,
        },
        select: {
          friends: true,
        },
      })) 
      const friends = JSON.parse(userFriendTable?.friends || "[]") as {userId:string}[] |[]

      const friendsProfile = await clerkClient.users.getUserList({
        userId:friends.map(user=>user.userId)
      })
      return friendsProfile.map(user=>filterUser(user))
})
})