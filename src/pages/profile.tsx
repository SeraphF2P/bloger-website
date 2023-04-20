import { BlogPost, Container } from "@/components";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "../utils/api";

const Profile: NextPage = ({}) => {
  const { user } = useUser();
  if (!user)
    return (
      <Container>
        <div>please sign in to access this page</div>
      </Container>
    );

  const { data } = api.post.getUserPosts.useQuery();

  return (
    <>
      <Head>
        <title>{user?.username} Profile</title>
        <meta
          name="auther"
          content={
            user.username ||
            `${user.firstName || "user"} ${user.lastName || ""}`
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <div className=" relative mb-[20%] h-40 w-full bg-red-400">
          <div className=" absolute -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full ">
            <Image
              fill
              src={user.profileImageUrl}
              alt={`${user.fullName || "user"}'s profile picture`}
            />
          </div>
        </div>
        <div className=" w-full p-2  text-center">
          <h1>{user.fullName}</h1>
        </div>
        <div className=" w-full bg-red-400 p-2">
          {data?.posts &&
            data?.posts.map((post): JSX.Element => {
              return (
                <BlogPost key={post.id} auther={data.auther} post={post} />
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default Profile;
