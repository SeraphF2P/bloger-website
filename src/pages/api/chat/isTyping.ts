

import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/index";



const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const {chatId,chatPartnerId,isTyping} =req.query as  unknown as {chatId:string,chatPartnerId:string,isTyping:boolean}
 await pusherServer.trigger(toPusherKey(`chatapp:${chatId}:${chatPartnerId}`),"isTyping",isTyping)
  res.status(200);
};

export default GET;