import { BlogPost } from "@/components/index";
import { Container, Icons, Loading, SkeletonLoadingPage } from "@/ui";
import { type RouterOutputs, api } from "@/utils/api";
import Error from "next/error";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";

type User = RouterOutputs["user"]["getUserProfile"];
function PostsSection({ auther }: { auther: User }) {
  if (!auther) return null;
  const { data, hasNextPage, fetchNextPage } =
    api.user.getUserPosts.useInfiniteQuery(
      { userId: auther.id, limit: 5 },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
        // keepPreviousData: true,
      }
    );
  // if (isLoading)
  //   return (
  //     <SkeletonLoadingPage
  //       count={4}
  //       className=" flex w-full flex-col gap-8  p-2"
  //     />
  //   );
  if (!data || data.pages.flatMap((page) => page.posts).length == 0)
    return (
      <div className=" min-h-40 flex  w-full flex-col items-center justify-center rounded bg-slate-300 p-8 dark:bg-slate-500">
        <Icons.error className=" w-40  " />
        <h3 className=" capitalize">user dont have any post</h3>
      </div>
    );
  const posts = data.pages.flatMap((page) => page.posts);
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <SkeletonLoadingPage
          count={4}
          className=" flex w-full flex-col gap-8  p-2"
        />
      }
      className=" flex w-full flex-col gap-8  p-2"
    >
      {posts &&
        posts.map((post): JSX.Element => {
          return <BlogPost key={post.id} auther={auther} {...post} />;
        })}
    </InfiniteScroll>
  );
}

const Profile = () => {
  const { query } = useRouter();
  const userId = query.userId?.toString() as string;
  const { data: auther, isLoading } = api.user.getUserProfile.useQuery(userId);
  if (!auther) return <Error statusCode={404} withDarkMode />;

  return (
    <>
      <Head>
        <title>{auther.username} Profile</title>
        <meta name="auther" content={auther.username} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        {isLoading && <Loading as="component" />}
        <section className=" pb-[51px] ">
          <div className=" relative h-40 w-full bg-primary">
            <div className=" absolute -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full ">
              <Image
                fill
                src={auther.profileImageUrl}
                alt={`${auther.username}'s profile picture`}
              />
            </div>
          </div>
        </section>
        <div className=" w-full p-2  text-center">
          <h1>{auther.username}</h1>
        </div>
        <PostsSection auther={auther} />
      </Container>
    </>
  );
};

export default Profile;
