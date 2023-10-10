
declare global {
enum NoteEnumType {
  friendrequest,
  friendrequestconfirmed,
  newlike,
  newcomment
}
type NoteType = "friendrequest"|"friendrequestconfirmed"|"newlike"|"newcomment"

  interface NotificationType {
    id: string,
    createdAt: Date,
    from: string,
    to: string
    type:NoteType,
    onPost?:string,
    }
}
export {}