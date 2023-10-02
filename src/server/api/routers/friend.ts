import { filterUser } from "@/utils/data-filters";
import { fromChatId, toChatId } from "@/utils/index";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";


export const friendRouter = createTRPCRouter({
    ConfirmFriendRequest: privateProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input: autherId }) => {
      const chatId =toChatId(ctx.userId,autherId)
   await Promise.allSettled([
        ctx.redis.rpush(`friendship:${ctx.userId}`,autherId),
        ctx.redis.rpush(`friendship:${autherId}`, ctx.userId), 
        ctx.redis.chat.create({userId:ctx.userId,chatId}),
        ctx.redis.chat.create({userId:autherId,chatId}),
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
  
    const chatIds = await ctx.redis.lrange(`chat:${ctx.userId}`,0,-1)
    
    
    const chatPartnerIds = chatIds.map(chatId =>{
      const [user1,user2] = fromChatId(chatId)
      return ctx.userId == user1 ? user2:user1
    })
    if(chatPartnerIds.length <1) return [];
    
    const chatPartnerProfiles = await clerkClient.users.getUserList({userId:chatPartnerIds})
    return await Promise.all(chatPartnerProfiles.map(async(user)=>{
      const chatId= toChatId(user.id,ctx.userId)
      const id = await ctx.redis.lindex(`chatapp:${chatId}`,-1) as unknown as string
      const msg = await ctx.redis.hgetall(`chatapp:${chatId}:${id}`) as unknown as ChatMSGType
    return {chatPartner:filterUser(user),msg,chatId}
  })) 

  })
});
