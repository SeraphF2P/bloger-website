import { nanoid } from "nanoid"
import { createRedisHelper, red as redis } from "."
import { pusherServer } from "@/lib/pusher"
import { fromChatId, toPusherKey } from "@/utils/index"


const helper = createRedisHelper("chatapp")
 const chatapp={
  create:helper<{content:string,chatId:string,autherId:string},{success:boolean,msg:ChatMSGType}>(async ({table,params})=>{
    const id = nanoid()
    const createdAt = new Date()
    const msg ={
      id,createdAt,seen:false,...params
    }
    const [user1,user2] =fromChatId(params.chatId)
    const chatPartnerId = user1 == params.autherId ? user2 :user1
    const [ids,hashs] = await Promise.allSettled([
      redis.rpush(`${table}:${params.chatId}`,msg.id),
      redis.hset(`${table}:${params.chatId}:${msg.id}`,msg),
    ])
    
  const success = ids.status == "fulfilled" && hashs.status == "fulfilled"
  if(success) {
    await Promise.all([
      pusherServer.trigger(toPusherKey(`${table}:${params.chatId}`),"resiveMessage",msg),
      pusherServer.trigger(toPusherKey(`${table}:${params.chatId}:${chatPartnerId}`),"chatNotification",msg),
      pusherServer.trigger(toPusherKey(`${table}:${chatPartnerId}`),"messageNotifications",msg)
    ])
  } 
  return {success,msg}
  }),
  read:helper<{chatId:string,limit:number,cursor:number},ChatMSGType[] |[]>(async ({table,params:{chatId,limit,cursor}})=>{

const ids = await redis.lrange(`${table}:${chatId}`,-cursor -limit,-cursor-1)
    const msgs  = await Promise.all(
       ids.map( async id=>{
         return await redis.hgetall(`${table}:${chatId}:${id}`) as ChatMSGType 
       })
      )
     
   return  msgs 
  })
}
export default chatapp