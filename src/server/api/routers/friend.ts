import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { filterUser } from "@/utils/data-filters";
import { clerkClient } from "@clerk/nextjs/server";
import { toChatId } from "@/utils/index";


export const friendRouter = createTRPCRouter({
    ConfirmFriendRequest: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: autherId }) => {
   await Promise.allSettled([
        ctx.redis.rpush(`friendship:${ctx.userId}`,autherId),
        ctx.redis.rpush(`friendship:${autherId}`, ctx.userId), 
        ctx.redis.note.create({
          from:ctx.userId,
          to:autherId,
          type:"friendrequestconfirmed",
      })
      ])
    
      void ctx.revalidate?.(`/profile/${ctx.userId}`);
      void ctx.revalidate?.(`/profile/${autherId}`);
    }),
  getFriends: privateProcedure
    .query(async ({ ctx }) => {
    const friends = await  ctx.redis.lrange(`friendship:${ctx.userId}`,0,-1)
     if(friends.length < 1)return []
      const friendsProfile = await clerkClient.users.getUserList({
        userId:friends
      })
      return friendsProfile.map(user=>filterUser(user))
}),
  getAllChat:privateProcedure.query(async({ctx})=>{
    const friends = await  ctx.redis.lrange(`friendship:${ctx.userId}`,0,-1)
    const chatIds = friends.map((friendId)=> toChatId(friendId,ctx.userId))

 if(friends.length < 1)return [];
    const [lastMsgs,friendsProfile] = await Promise.all([
      ctx.redis.chat.getAllChats({chatIds}),
      clerkClient.users.getUserList({userId:friends})
    ]) 

    return friendsProfile.map(user=>{
      return {
        chatPartner:filterUser(user),
        lastMsg: lastMsgs.find(msg=>msg.autherId === user.id),
      }
      })

  })
   
});
