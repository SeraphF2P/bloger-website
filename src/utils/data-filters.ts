import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import type { Like, Post } from "@prisma/client";

export const filterUser = (user: ClerkUser) => {
  const { gender, id, firstName, lastName, profileImageUrl, username } = user;
  const userInfo = {
    id: id,
    gender: gender,
    firstName: firstName,
    lastName: lastName,
    username: `@${username || ""}` || `${firstName || "user"} ${lastName || ""}`,
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
  let likeSectionCaption 
		if (likesCount > 0) {
			if (isLiked && likesCount == 1) {
          likeSectionCaption= "you"
        }else if(isLiked && likesCount > 1){
          likeSectionCaption= `you and ${likesCount - 1} other liked this post`
        }else {
				likeSectionCaption= `${likesCount} people have liked this post`;
			}
		}
	
    return {
      likesCount,
      commentsCount: post._count.Comment,
      isLiked ,
      likeSectionCaption,
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
  let likeSectionCaption 
		if (likesCount > 0) {
			if (isLiked && likesCount == 1) {
          likeSectionCaption= "you"
        }else if(isLiked && likesCount > 1){
          likeSectionCaption= `you and ${likesCount - 1} other liked this post`
        }else {
				likeSectionCaption= `${likesCount} people have liked this post`;
			}
		}
    return {
      likesCount,
      commentsCount: post._count.Comment,
      isLiked,
      likeSectionCaption,
      ...post
    };
  });
  return data;
};
