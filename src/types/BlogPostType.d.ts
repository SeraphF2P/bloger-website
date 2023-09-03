import type { filterPosts } from "@/utils/data-filters";

type Post = ReturnType<typeof filterPosts>[number];

declare global {
  interface BlogPostType extends Post {
    auther: AutherType;
  }
}
