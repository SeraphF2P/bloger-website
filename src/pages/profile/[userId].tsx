import { api } from "../../utils/api";
import { BlogPost } from "@/components";
import { Loading } from "@/ui";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";

const Profile = ({ userId }: { userId: string }) => {
  const { data: auther, isLoading } = api.user.getUserInfo.useQuery(userId);
  const { data: posts } = api.user.getUserPosts.useQuery(userId);
  if (isLoading) return <Loading as="page" />;
  if (!auther) return <div>not found</div>;

  return (
    <>
      <Head>
        <title>{auther?.username} Profile</title>
        <meta name="auther" content={auther.username} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div className=" relative mb-[20%] h-40 w-full bg-red-400">
          <div className=" absolute -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full ">
            <Image
              fill
              src={auther.profileImageUrl}
              alt={`${auther.username}'s profile picture`}
            />
          </div>
        </div>
        <div className=" w-full p-2  text-center">
          <h1>{auther.username}</h1>
        </div>
        <div className=" flex w-full flex-col gap-8  p-2">
          {posts &&
            posts.map((post): JSX.Element => {
              return <BlogPost key={post.post.id} {...post} auther={auther} />;
            })}
        </div>
      </>
    </>
  );
};

export default Profile;

export const getStaticProps: GetStaticProps = (context) => {
  const userId = context.params?.userId;
  return {
    props: {
      userId: userId,
    },
  };
};
export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: false,
  };
};
