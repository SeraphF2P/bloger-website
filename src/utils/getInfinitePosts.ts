import { TRPCError } from "@trpc/server";
import type { createTRPCContextType } from "../server/api/trpc";
import {
  filterPostsWithAuther,
  filterPostsWithOutAuther,
  filterUser,
} from "./data-filters";
import { clerkClient } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

export async function getInfiniteProfilePosts({
  userId,
  whereClause,
  limit,
  cursor,
  ctx,
}: {
  userId: string;
  whereClause: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: createTRPCContextType;
}) {
  const posts = await ctx.prisma.post.findMany({
    where: whereClause,
    take: limit + 1,
    cursor: cursor ? { id: cursor.id, createdAt: cursor.createdAt } : undefined,
    orderBy: [{ id: "desc" }, { createdAt: "desc" }],
    include: {
      likes: true,
      _count: { select: { likes: true, Comment: true } },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    if (nextItem != null) {
      nextCursor = {
        createdAt: nextItem.createdAt,
        id: nextItem.id,
      };
    }
  }
  const filteredPosts = filterPostsWithOutAuther(posts, userId);
  return {
    posts: filteredPosts,
    nextCursor,
  };
}
export async function getInfinitePosts({
  whereClause,
  limit,
  cursor,
  ctx,
}: {
  whereClause: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: createTRPCContextType;
}) {
  const posts = await ctx.prisma.post.findMany({
    where: whereClause,
    take: limit + 1,
    cursor: cursor ? { id: cursor.id, createdAt: cursor.createdAt } : undefined,
    orderBy: [{ id: "desc" }, { createdAt: "desc" }],
    include: {
      likes: true,
      _count: { select: { likes: true, Comment: true } },
    },
  });
  
  const users = await clerkClient.users.getUserList({
    userId: posts.map((post) => post.autherId),
    limit: limit + 1,
  });
  let nextCursor: typeof cursor | undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    if (nextItem != null) {
      nextCursor = {
        createdAt: nextItem.createdAt,
        id: nextItem.id,
      };
    }
  }
  const postsWithAuther = posts.map((post) => {
    const auther = users.find((user) => user.id == post.autherId);
    if(!auther) throw new TRPCError({code:"NOT_FOUND"});
    return {
      auther: filterUser(auther),
      ...post,
    };
  });
  const filteredPosts = filterPostsWithAuther(postsWithAuther, ctx.userId);
  return {
    posts: filteredPosts,
    nextCursor,
  };
}
