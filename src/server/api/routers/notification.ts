import { noteTypeValidator } from "@/lib/zod-validetors";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
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
    const status = await  ctx.redis.note.create({
        from:ctx.userId,
        to:input.to,
        type:input.type,
      })

      
     return status
    }),
  delete: privateProcedure
    .input(z.object({
      id:z.string(),
      from:z.string(),
      to:z.string(),
      type:noteTypeValidator,
    }))
    .mutation(async ({ ctx, input }) => {
    return await ctx.redis.note.delete(input)
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
    .mutation(async({ ctx, input }) => {
      await ctx.redis.note.update(input)
    }),
  get: privateProcedure
    .query(async ({ ctx }) => {
      
    const notification = await ctx.redis.note.findMany({
      to:ctx.userId,
      type:"friendrequest",
    })
    if(notification == null) return [];

     const notifyFroms =await clerkClient.users.getUserList({userId:notification.map(note=> note.from)})

  const noteIdList = notification.map(note=>note.id)
await Promise.all(
  noteIdList.map(
   async (id:string)=>{
      await ctx.redis.note.update({id,to:ctx.userId,data:{seen:true}})
    }))
     
     
      return notification.map(note=>{
        const notifyFrom = notifyFroms.find(user=>user.id == note.from)
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
     return await ctx.redis.note.count({
      to:ctx.userId
     })
    }),
   
});
