import type { filterPostsWithOutAuther } from "@/utils/data-filters";

type Post = ReturnType<typeof filterPostsWithOutAuther>[number];

declare global {
  interface BlogPostType extends Post {
    auther: AutherType;
  }
}
