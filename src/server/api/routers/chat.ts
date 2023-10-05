import { filterUser } from "@/utils/data-filters";
import { fromChatId, toChatId, toPusherKey } from "@/utils/index";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { pusherServer } from "../../../lib/pusher";


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

  }),
  getChatMsgs:privateProcedure.input(z.object({
    chatId:z.string().min(1),
    limit:z.number().optional().default(10),
    cursor:z.number().optional().default(0)
  })).query(async({ctx,input:{chatId,limit,cursor}})=>{
     if(chatId.includes(ctx.userId) ==  null) throw new TRPCError({code:"UNAUTHORIZED",cause:"user not in the chat"});
     const msgs = await ctx.redis.chatapp.read({chatId,limit:limit +1,cursor})
       const [user1,user2] =fromChatId(chatId);
       const chatPartnerId = user1 === ctx.userId?user2:user1
       const nextCursor = msgs.length + cursor;
        let lastMsgsIds = {
          user:"",
         chatPartner:""
        }
        if(cursor  == 0){
       lastMsgsIds={
         user:
           msgs.findLast((msg) => msg.autherId === ctx.userId)?.id || "",
         chatPartner:
           msgs.findLast((msg) => msg.autherId === chatPartnerId)?.id || "",
       }
        }
       return ({
        nextCursor,
        hasNextPage:nextCursor  % (limit + 1) == 0,
        msgs,
        lastMsgsIds
	});
  }),

  sendMsg:privateProcedure.input(z.object({
  chatId:z.string().min(1),
  content: z.string().min(1).max(255)
})).mutation(async({ctx,input:{chatId,content}})=>{

   if(chatId.includes(ctx.userId) ==  false) throw new TRPCError({code:"UNAUTHORIZED",cause:"user not in the chat"});
     const {success} = await ctx.redis.chatapp.create({content,autherId: ctx.userId,chatId})
     return({ success });
  }),

  changeTypingState:privateProcedure.input(z.object({
  chatId:z.string().min(1),
  chatPartnerId: z.string().min(1).max(255),
  isTyping: z.boolean(),
})).mutation(async({ctx,input:{chatId,chatPartnerId,isTyping}})=>{

   if(chatId.includes(ctx.userId) ==  false) throw new TRPCError({code:"UNAUTHORIZED",cause:"user not in the chat"});
     await pusherServer.trigger(toPusherKey(`chatapp:${chatId}:${chatPartnerId}`),"isTyping",isTyping)

  }) 
});
