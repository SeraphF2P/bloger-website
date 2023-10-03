import redis from "@/server/redis";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


const validatePostReq = z.object({
  chatId:z.string().min(1),
  content: z.string().min(1).max(255)
})

 export default  async function POST(req: NextApiRequest, res: NextApiResponse) {
   const {userId,sessionId} = getAuth(req)
   if(!userId || !sessionId)  return res.status(401);
     const validData = validatePostReq.parse(req.body)
     if(!validData) return res.status(400)
     const {chatId,content} = validData
    if(chatId.includes(userId) ==  null)  return res.status(401);
     const {success} = await redis.chatapp.post({content,autherId: userId,chatId})
     res.status(200).json({ success });
}

 

