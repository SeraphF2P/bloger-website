import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import type { Like, Post } from "@prisma/client";

export const filterUser = (user: ClerkUser) => {
  const { gender, id, firstName, lastName, profileImageUrl, username } = user;
  const userInfo = {
    id: id,
    gender: gender,
    firstName: firstName,
    lastName: lastName,
    username: username || `${firstName || "user"} ${lastName || ""}`,
    profileImageUrl: profileImageUrl ?? "/male-avatar.webp",
  };
  return userInfo;
};
interface UnfilterPostWithOutAuther extends Post {
  likes: Like[];
  _count: {
    likes: number;
    Comment: number;
  };
}
interface UnfilterPostWithAuther extends UnfilterPostWithOutAuther {
  auther: AutherType;
}
export const filterPostsWithAuther = (
  posts: UnfilterPostWithAuther[],
  userId: string | null
) => {
  return posts.map((post) => {
    const isLiked = userId
      ? post.likes.some((like) => like.autherId == userId)
      : false;
    return {
      likesCount: post._count.likes,
      commentsCount: post._count.Comment,
      isLiked,
      ...post,
    };
  });
};
export const filterPostsWithOutAuther = (
  posts: UnfilterPostWithOutAuther[],
  userId: string | null
) => {
  const data = posts.map((post) => {
    const isLiked = userId
      ? post.likes.some((like) => like.autherId == userId)
      : false;
    return {
      likesCount: post._count.likes,
      commentsCount: post._count.Comment,
      isLiked,
      ...post,
    };
  });
  return data;
};
