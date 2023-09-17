import { Redis } from '@upstash/redis';
import { note } from './note';
import chat from './chat';
import chatapp from './chatApp';

// export const revalidate = 0 // disable cache 


 export const red = Redis.fromEnv()
 
 export function createRedisHelper(table:string){
  return <T,K>(fn: ({ table ,params}: { table: string; params: T }) => Promise<K>)=>{
     return (params: T) => fn({table,params})
     }
 }


const redis = {
  note,
  chat,
  chatapp,
  ...red
}
export default redis
export type CustomRedisType = typeof redis
