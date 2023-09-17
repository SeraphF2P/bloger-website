import { chatRouter } from "./routers/chat";
import { commentRouter } from "./routers/comment";
import { friendRouter } from "./routers/friend";
import { notificationRouter } from "./routers/notification";
import { userRouter } from "./routers/user";
import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  notification: notificationRouter,
  friend: friendRouter,
  chat:chatRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
