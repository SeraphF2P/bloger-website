import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType, Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  createOrDelete: privateProcedure
    .input(z.object({
      type:z.nativeEnum(NotificationType),
      from:z.string(),
      to:z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const note =await ctx.prisma.notification.findFirst({
        where:input
      })
      if(note){
        await ctx.prisma.notification.delete({
         where:{
           id:note.id
         }
       })
      }else{
        await ctx.prisma.notification.create({
            data:input
          })
      }
      
    }),
  delete: privateProcedure
    .input(z.object({
      id:z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.prisma.notification.delete({
         where:{
           id:input.id
         }
       })
    }),
  update: privateProcedure
    .input(z.object({
      id:z.string(),
      seen:z.boolean(),
    }))
    .mutation(async({ ctx, input }) => {
      await ctx.prisma.notification.update({
        where:{
          id:input.id,
        },
        data:{
         seen:input.seen
        }
      })
    }),
  get: privateProcedure
    .query(async ({ ctx }) => {
     const notification = await ctx.prisma.notification.findMany({
      where:{
          to:ctx.userId
        },
      orderBy:{
       createdAt:"desc"
      }
      })
      const notifiesFrom =await clerkClient.users.getUserList({userId:notification.map(note=>note.from)})
      await ctx.prisma.notification.updateMany({
        where:{
        id:{
         in:notification.map(note=>note.id)
        },
          seen:false,
          to:ctx.userId,
        },
        data:{
          seen:true
        }
      })
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
return await ctx.prisma.notification.count({
  where:{
    to:ctx.userId,
    seen:false
  }
})

    })
});
