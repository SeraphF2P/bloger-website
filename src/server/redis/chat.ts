import { nanoid } from "nanoid"
import { createRedisHelper, red as redis } from "."
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/utils/index"


const helper = createRedisHelper("chat")
 const chat={
  post:helper<{content:string,chatId:string,autherId:string},{success:boolean,msg:ChatMSGType}>(async ({table,params})=>{
    const id = nanoid()
    const createdAt = new Date()
    const msg ={
      id,createdAt,seen:false,...params
    }
    const [user1,user2] =params.chatId.split("--")
    const chatPartner = user1 == params.autherId ? user2 :user1
    const [ids,hashs] = await Promise.allSettled([
      redis.rpush(`${table}:${params.chatId}`,msg.id),
      redis.hset(`${table}:${params.chatId}:${msg.id}`,msg),
    ])

  const success = ids.status == "fulfilled" && hashs.status == "fulfilled"
  if(success) {
    await Promise.all([
      pusherServer.trigger(toPusherKey(`${table}:${params.chatId}`),"resiveMessage",msg),
      pusherServer.trigger(toPusherKey(`${table}:${params.chatId}:${chatPartner}`),"chatNotification",msg),
      pusherServer.trigger(toPusherKey(`${table}:${chatPartner}`),"messageNotifications",msg)
    ])
  } 
  return {success,msg}
  }),
  get:helper<{chatId:string},ChatMSGType[] |[]>(async ({table,params})=>{

const ids = await redis.lrange(`${table}:${params.chatId}`,0,-1)
    const msgs  = await Promise.all(
       ids.map( async id=>{
         return await redis.hgetall(`${table}:${params.chatId}:${id}`) as ChatMSGType 
       })
      )
   return  msgs 
  }),
  count: helper<{to:string,chatId:string},{count:number,lastMsg:ChatMSGType | null}>(async({table,params})=>{

  const messageIds =await redis.lrange(`${table}:${params.chatId}`,0,-1)
  
  if(messageIds.length > 0){
    const [lastMsg,...msgs] = await Promise.all([
      redis.hgetall(`${table}:${params.chatId}:${messageIds.at(-1) || ""}`) as unknown as ChatMSGType,
      ...messageIds.map(async(id :string)=>{
      return await redis.hmget(`${table}:${params.chatId}:${id}`,'seen') as unknown as {seen:boolean}
    }),
    ])

    if(msgs && lastMsg){
      const count = msgs.filter((msg) => msg.seen == false).length
      return{
       count,
       lastMsg
      }
    }
  }
 return {
  count:0,
  lastMsg: null
 } 

 }),
 getAllChats:helper<{chatIds:string[]},ChatMSGType[]>( async({table,params})=>{

  const ids = await Promise.all(params.chatIds.map(async(chatId)=>{
    const id = (await redis.lrange(`${table}:${chatId}`,-1,-1))[0]
   return {id,chatId}
  })) 
 console.log(ids)
 const result =await Promise.all(ids.map( async({id,chatId})=>{
     return  await redis.hgetall(`${table}:${chatId}:${id}`) as unknown as ChatMSGType
    }))

  console.log(result)
  return result

 })
}
export default chat