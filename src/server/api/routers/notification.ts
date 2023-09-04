import { clerkClient } from "@clerk/nextjs/server";
import { NotificationType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({
      type:z.nativeEnum(NotificationType),
      from:z.string(),
      to:z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.create({
        data:input
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
});
