import { noteTypeValidator } from "@/lib/zod-validetors";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import createNotification from "../../../utils/createNotification";
import { createTRPCRouter, privateProcedure } from "../trpc";


export const notificationRouter = createTRPCRouter({
   create: privateProcedure
    .input(z.object({
      id:z.string().optional(),
      from:z.string(),
      to:z.string(),
      type:noteTypeValidator,
    }))
    .mutation(async ({ ctx, input }) => {
      const {id,...notify}   =createNotification(input)
      const activeId = input.id ?? id
      const status = await Promise.allSettled(
         [
          ctx.redis.rpush(`notifications:${input.from}:${input.to}:${input.type}`,activeId),
          ctx.redis.hset(`notifications:${input.from}:${input.to}:${input.type}:${activeId}`, notify),
        ]
      )
     return {...status}
    }),
  delete: privateProcedure
    .input(z.object({
      id:z.string(),
      from:z.string(),
      to:z.string(),
      type:noteTypeValidator,
    }))
    .mutation(async ({ ctx, input }) => {
    return await Promise.all([
      ctx.redis.srem(`notification:${ctx.userId}:${input.type}:${input.id}`,input.id),
      ctx.redis.hdel(`notification:${ctx.userId}:${input.type}:${input.id}`)
    ])  
    }),
  update: privateProcedure
    .input(z.object({
      id:z.string(),
      to:z.string(),
      type:noteTypeValidator,
      data:z.object({
       seen:z.boolean().optional(),
       confirmed:z.boolean().optional(),
     })
    }))
    .mutation(async({ ctx, input:{id,to,type,data} }) => {
      await ctx.redis.hmset(`notifications:${to}:${type}:${id}`,data)
    }),
  get: privateProcedure
    .query(async ({ ctx }) => {
      
const noteIdList = await ctx.redis.lrange(`notifications:${ctx.userId}`,0,-1)

     const notification= await Promise.all(
      noteIdList.map( (id)=>{
       return  ctx.redis.hgetall(`notifications:${ctx.userId}:${id}`)  as unknown as NotificationType
      }),
      
    )
    
    
   
    if(notification == null) return [];

     const userIds =notification.map(note=> note.from)

     
     const notifiesFrom =await clerkClient.users.getUserList({userId:userIds})

  
await Promise.all(
  noteIdList.map(
   async (id)=>{
      await ctx.redis.hmset(`notifications:${ctx.userId}:${id}`,{"seen":true}) 
    }))
     
      return notification.map(note=>{
        const notifyFrom = notifiesFrom.find(user=>user.id == note.from)
        if(notifyFrom == null)throw new Error("some thing went wrong");
        return {
            notifyFrom:{
              id:notifyFrom.id,
              username:notifyFrom.username || `${notifyFrom.firstName || ""}  ${notifyFrom.lastName || ""}`,
              profileImageUrl:notifyFrom.profileImageUrl
            },
            ...note
        }
      })
    }),
    count:privateProcedure.query(async({ctx})=>{
     const ids = await ctx.redis.lrange(`notifications:${ctx.userId}`,0,-1);

     const notification= await Promise.all(
      ids.map( (id)=>{
       return  ctx.redis.hmget(`notifications:${ctx.userId}:${id}`,"seen")  as unknown as {seen:boolean}
      })
     )
     const count =notification.filter(note=>note.seen == false).length
     return count
    }),
   
});
