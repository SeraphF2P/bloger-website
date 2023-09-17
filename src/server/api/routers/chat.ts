import { filterUser } from "@/utils/data-filters";
import { fromChatId, toChatId } from "@/utils/index";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "../trpc";


export const chatRouter = createTRPCRouter({
  getAllChat:privateProcedure.query(async({ctx})=>{
    const friends = await  ctx.redis.lrange(`friendship:${ctx.userId}`,0,-1)
 if(friends.length < 1)return [];
    const chatIds = await ctx.redis.lrange(`chat:${ctx.userId}`,0,-1)
    const chatPartnerIds = chatIds.map(chatId =>{
      const [user1,user2] = fromChatId(chatId)
      return ctx.userId == user1 ? user2:user1
    })
    if(chatPartnerIds.length <1) return;

      const chatPartnerProfiles = await clerkClient.users.getUserList({userId:chatPartnerIds})
    return await Promise.all(chatPartnerProfiles.map(async(user)=>{
    const chatId= toChatId(user.id,ctx.userId)

    const id = await ctx.redis.lindex(`chatapp:${chatId}`,-1) as unknown as string
    const msg = await ctx.redis.hgetall(`chat:${chatId}:${id}`) as unknown as ChatMSGType
  
    return {chatPartner:filterUser(user),msg,chatId}
  })) 

  })
});
