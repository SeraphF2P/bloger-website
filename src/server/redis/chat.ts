import { nanoid } from "nanoid"
import { createRedisHelper ,red as redis} from "."


const helper = createRedisHelper("chat")
 const chat={
  post:helper<{content:string,chatId:string,autherId:string},boolean>(async ({table,params})=>{
    console.log(params)
const id = nanoid()
const createdAt = new Date()
const message ={
  id,createdAt,...params
}
    const [ids,hashs] = await Promise.allSettled([
       redis.rpush(`${table}:${params.chatId}`,id),
       redis.hset(`${table}:${params.chatId}:${id}`,message)
      ])
   return ids.status == "fulfilled" && hashs.status == "fulfilled"
  }),
  get:helper<{chatId:string},ChatMSGType[] |[]>(async ({table,params})=>{

const ids = await redis.lrange(`${table}:${params.chatId}`,0,-1)
    const msgs  = await Promise.all(
       ids.map( async id=>{
         return await redis.hgetall(`${table}:${params.chatId}:${id}`) as ChatMSGType 
       })
      )
   return  msgs 
  })
}
export default chat