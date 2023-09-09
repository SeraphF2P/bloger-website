import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

// export const revalidate = 0 // disable cache 


 export const red = Redis.fromEnv()

const helper = createHelper("notification")

function createHelper(table:string){
 return <T,K>(fn: ({ table ,params}: { table: string; params: T }) => Promise<K>)=>{
    return (params: T) => fn({table,params})
    }
}

const note ={
  create: helper<Omit<Omit<NotificationType, "id">, "createdAt">,boolean>(async ({table,params})=>{

      const id = params.type == "friendrequest" ? `${params.from}-${params.to}`:nanoid();
      const createdAt =new Date()
    
     const value  ={id,createdAt,seen:false,confirmed:false,...params} satisfies NotificationType
    
     const Promises = await Promise.allSettled([
        red.rpush(`${table}:${params.to}`,id),
        red.hset(`${table}:${params.to}:${id}`,value)
     ])
    
     return Promises.every(prom=>prom.status == "fulfilled")
}),
 findMany:helper<{ to:string, type:NoteType},NotificationType[]>(async({table,params})=>{
    const noteIdList = await red.lrange(`${table}:${params.to}`,0,-1)  
    return  await Promise.all(
      noteIdList.map(async (id)=>{
        return await red.hgetall(`${table}:${params.to}:${id}`)  as unknown as NotificationType
      }),)
    })
,
 delete: helper<{id:string, to:string, type:NoteType},unknown>(async({table,params})=>{
   return await Promise.all([
      red.srem(`${table}:${params.to}`),
      red.hdel(`${table}:${params.to}:${params.id}`)
    ])  
      }),
update:helper<{id:string, to:string,data:{seen?:boolean,confirmed?:boolean}},"OK">(async({table,params})=>{
   return await red.hmset(`${table}:${params.to}:${params.id}`,params.data)
   }),
count: helper<{to:string},number>(async({table,params})=>{
const ids =await red.lrange(`${table}:${params.to}`,0,-1)
const groupedBySeen = await Promise.all(ids.map(async(id)=>{
  return await red.hmget(`${table}:${params.to}:${id}`,'seen') as unknown as {seen:boolean}
}))
const unSeen =groupedBySeen.filter(note=> note.seen == false)
return unSeen.length
 })
}

const redis = {
  note,
  ...red
}

export type CustomRedisType = typeof redis
export default redis