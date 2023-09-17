import { createRedisHelper, red as redis } from "."


const helper = createRedisHelper("chat")
 const chat={
  create:helper<{userId:string,chatId:string},boolean>(async({table,params})=>{
const success =await redis.rpush(`${table}:${params.userId}`,params.chatId)
return success != 0
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
}
export default chat