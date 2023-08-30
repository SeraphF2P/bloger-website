import { commentRouter } from "./routers/comment";
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
