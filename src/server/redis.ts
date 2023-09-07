import { Redis } from '@upstash/redis'

// export const revalidate = 0 // disable cache 


export const redis = Redis.fromEnv()
// type RedisHelperProps<T> ={
//   table:string,
//   method :keyof typeof redis,
//   params :T
// }
//  // ? `table:sender:reciver:type:uniqeId`
// export async function redisHelper({table,method,params}:RedisHelperProps<NotificationType>){
//   const parValues = Object.values(params);
//   const parStr = parValues.join(":")
//   console.log(parStr)
// //  const key = `${table}:${params.from}:${params.to}:${params.type}:uniqeId`
// //  const db = redis[method] as (...args: any[]) => Promise<any>;
// //   if(typeof db != "function")return db;
// //    await db(key,params);
// }