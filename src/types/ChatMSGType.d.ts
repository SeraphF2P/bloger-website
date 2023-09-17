

declare global {
  type ChatMSGType ={
    id:string,
    autherId:string,
    chatId:string,
    createdAt:Date,
    content:string,
    seen:boolean,
  }
}
export {}