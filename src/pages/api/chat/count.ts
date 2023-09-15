import redis from "@/server/redis";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const validateGETReq = z.object({
  chatId:z.string().min(1),
})
 export default async function GET(req: NextApiRequest, res: NextApiResponse) {
   const {userId,sessionId} = getAuth(req)
   if(!userId || !sessionId)  return res.status(401);

    const validData = validateGETReq.parse({chatId:req.query.chatId})
   if(!validData) return res.status(400)
     const {chatId} = validData
     const {count,lastMsg} = await redis.chat.count({to:userId,chatId})

       res.status(200).json({count,lastMsg});

}

