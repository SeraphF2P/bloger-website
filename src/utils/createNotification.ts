import { nanoid } from 'nanoid'
type createNotificationProps =Omit<Omit<NotificationType,'id'>, 'createdAt'>  
export default function createNotification(props:createNotificationProps) {
  
  const {seen,...rest}=props
  const id = nanoid()
  return {
            id,
            createdAt:new Date(),
            seen:seen || false,
           ...rest
          }
}
