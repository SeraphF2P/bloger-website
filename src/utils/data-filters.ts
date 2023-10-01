import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import type { Like, Post } from "@prisma/client";

export const filterUser = (user: ClerkUser) => {
  const { gender, id, firstName, lastName, profileImageUrl, username } = user;
  const userInfo = {
    id,
    gender,
    firstName,
    lastName,
    username: `@${username || ""}` ,
    profileImageUrl: profileImageUrl ?? "/male-avatar.webp",
  };
  return userInfo;
};
interface UnfilterPostWithOutAuther extends Post {
  likes:Like[],
  _count: {
    likes: number;
    Comment: number;
  };
} 
interface UnfilterPostWithAuther extends UnfilterPostWithOutAuther {
  auther:AutherType,
} 
export const filterPosts = (
  posts: UnfilterPostWithAuther[],
) => {
  const data = posts.map((post) => {
    const likesCount=post._count.likes
    const isLiked=post.likes.length > 0
	
    return {
      likesCount,
      commentsCount: post._count.Comment,
      isLiked ,
      ...post
    };
  });
  return data;
};
export const filterProfilePosts = (
  posts: UnfilterPostWithOutAuther[],
) => {
  const data = posts.map((post) => {
   const likesCount=post._count.likes
    const isLiked=post.likes.length > 0
    return {
      likesCount,
      commentsCount: post._count.Comment,
      isLiked,
      ...post
    };
  });
  return data;
};
