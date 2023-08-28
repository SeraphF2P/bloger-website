import { BlogPost } from "@/components/index";
import { Container, Loading } from "@/ui";
import { api } from "@/utils/api";
import { clerkClient } from "@clerk/nextjs/server";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";

const Profile = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = api.post.getUserPosts.useQuery(userId);
  if (isLoading) return <Loading as="page" />;
  if (isError) return <>no data</>;
  const { auther, posts } = data;
  return (
    <>
      <Head>
        <title>{auther?.username} Profile</title>
        <meta name="auther" content={auther.username} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
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
        <div className=" flex w-full flex-col gap-8  p-2">
          {posts &&
            posts.map((post): JSX.Element => {
              return <BlogPost key={post.post.id} {...post} />;
            })}
        </div>
      </Container>
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
export const getStaticPaths = async () => {
  const data = await clerkClient.users.getUserList();
  const paths = data?.map((user) => {
    return {
      params: { userId: user.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
