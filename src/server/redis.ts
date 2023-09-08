import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

// export const revalidate = 0 // disable cache 


 export const red = Redis.fromEnv()

const keys={
  noteKey:({to}:{to:string})=> [note.name,to].join(":"),
}

const note ={
  name:"notification",
  create: async (params:Omit<Omit<NotificationType,"id">,"createdAt">)=>{
  const key =keys.noteKey({to:params.to})
 
  const id = params.type == "friendrequest" ? `${params.from}-${params.to}`:nanoid();
  const createdAt =new Date()

 const value  ={id,createdAt,seen:false,confirmed:false,...params} satisfies NotificationType

 const Promises = await Promise.allSettled([
    red.rpush(key,id),
    red.hset(`${key}:${id}`,value)
 ])

 return Promises.every(prom=>prom.status == "fulfilled")
},
 findMany: async (params:{ to:string, type:NoteType})=>{
  const key =keys.noteKey({to:params.to})
    const noteIdList = await red.lrange(key,0,-1)  
    return  await Promise.all(
      noteIdList.map(async (id)=>{
       return await red.hgetall(`${key}:${id}`)  as unknown as NotificationType
      }),)
},
 delete: async (params:{id:string, to:string, type:NoteType,})=>{
  const key =keys.noteKey({to:params.to})
   return await Promise.all([
      red.srem(`${key}`),
      red.hdel(`${key}:${params.id}`)
    ])  
},
update:async (params:{id:string, to:string,data:{
  seen?:boolean,
  confirmed?:boolean
}})=>{
  const key =keys.noteKey({to:params.to})
    await red.hmset(`${key}:${params.id}`,params.data)
},
count: async(params:{to:string})=>{
const key = keys.noteKey({to:params.to})
const ids =await red.lrange(key,0,-1)
const groupedBySeen = await Promise.all(ids.map(async(id)=>{
  return await red.hmget(`${key}:${id}`,'seen') as unknown as {seen:boolean}
}))
const unSeen =groupedBySeen.filter(note=> note.seen == false)
return unSeen.length
}
}

const redis = {
  note,
  ...red
}

export type CustomRedisType = typeof redis
export default redis