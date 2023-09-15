

declare global {
  type ChatMSGType ={
    id:string,
    autherId:string,
    createdAt:Date,
    content:string,
    seen:boolean,
  }
}
export {}