import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { filterPosts, filterUser } from "../../../utils/data-filters";
import { TRPCError } from "@trpc/server";


export const searchRouter = createTRPCRouter({
  search:publicProcedure.input(z.object({
    filter:z.enum(["user","post"]),
    content:z.string().min(1)
  })).mutation(async({ctx,input:{filter,content}})=>{
    const resualt : {
      users:AutherType[] |[],
      posts:BlogPostType[] |[],
    } = {
      users:[],
      posts:[]
    }
    if(filter == "user"){
      const users =await clerkClient.users.getUserList({query:`${content}`,limit:10});
      resualt.users = users.map(user => filterUser(user))
    }
    if(filter == "post"){
      const posts = await ctx.prisma.post.findMany({
        where:{
        OR:[{title:{  contains:content},content:{  contains:content},}]  
      },
     include: {
      likes: {where:{
        autherId:ctx.userId || undefined,
      }},
      _count: { select: { likes: true, Comment: true } },
    },
    take:10
  })
     console.log(posts)
     if(!posts)return resualt;
     const authers = await clerkClient.users.getUserList({userId:posts.map((post) =>post.autherId)})
     const postWithAuther = posts.map((post) => {
      const auther = authers.find(auther=>auther.id == post.autherId)
       if (!auther) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        auther :filterUser(auther),
        ...post
      }
     })
     resualt.posts = filterPosts(postWithAuther)
    }
    return resualt
  })
})