import { nanoid } from 'nanoid';
import {  createRedisHelper,red as redis} from './index'
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/utils/index';

const helper = createRedisHelper("note")

const note ={
  create: helper<Omit<Omit<NotificationType, "id">, "createdAt">,boolean>(async ({table,params})=>{

      const id = params.type == "friendrequest" ? `${params.from}-${params.to}`:nanoid();
      const createdAt =new Date()
    
     const note  ={id,createdAt,seen:false,confirmed:false,...params} satisfies NotificationType
    
     const Promises = await Promise.allSettled([
        redis.rpush(`${table}:${params.to}`,id),
        redis.hset(`${table}:${params.to}:${id}`,note),
        pusherServer.trigger(toPusherKey(`${table}:${params.to}`),`${table}`,{note})
     ])
    
     return Promises.every(prom=>prom.status == "fulfilled")
}),
 findMany:helper<{ to:string, type:NoteType},NotificationType[] |[]>(async({table,params})=>{
    const noteIdList = (await redis.lrange(`${table}:${params.to}`,0,-1)).reverse()
    return  await Promise.all(
      noteIdList.map(async (id:string)=>{
        return await redis.hgetall(`${table}:${params.to}:${id}`)  as unknown as NotificationType
      }))
    })
,
 delete: helper<{id:string, to:string, type:NoteType},unknown>(async({table,params})=>{
   return await Promise.all([
      redis.del(`${table}:${params.to}`),
      redis.hdel(`${table}:${params.to}:${params.id}`)
    ])  
      }),
update:helper<{id:string, to:string,data:{seen?:boolean,confirmed?:boolean}},"OK">(async({table,params})=>{
   return await redis.hmset(`${table}:${params.to}:${params.id}`,params.data)
   }),
count: helper<{to:string},number>(async({table,params})=>{
  const ids =await redis.lrange(`${table}:${params.to}`,0,-1)
const notes = await Promise.all(ids.map(async(id :string)=>{
  return await redis.hmget(`${table}:${params.to}:${id}`,'seen') as unknown as {seen:boolean}
}))
return  notes.filter((note) => note.seen == false).length;
 }),


}
export default note