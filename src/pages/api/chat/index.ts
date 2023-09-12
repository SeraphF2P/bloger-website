import redis from "@/server/redis";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


const validatePostReq = z.object({
  chatId:z.string().min(1),
  content: z.string().min(1).max(255)
})
const validateGETReq = z.object({
  chatId:z.string().min(1),
})
 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const {userId,sessionId} = getAuth(req)
   if(!userId || !sessionId)  return res.status(401);
  if(req.method === 'POST'){
    const validData = validatePostReq.parse(req.body)
   if(!validData) return res.status(400)
     const {chatId,content} = validData
     if(chatId.includes(userId) ==  null)  return res.status(401);
     const [user1,user2]= chatId.split("--")
     const {success} = await redis.chat.post({content,autherId: userId,chatId})
      console.log(userId == user1 ?user2:user1)
     
     res.status(200).json({ success });
  }
  if(req.method === "GET"){
    const validData = validateGETReq.parse({chatId:req.query.chatId})
   if(!validData) return res.status(400)
     const {chatId} = validData
     if(chatId.includes(userId) ==  null)  return res.status(401);
       const msgs = await redis.chat.get({chatId})

       res.status(200).json(msgs);
  }

}

