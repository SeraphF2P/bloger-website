import { api } from "../../utils/api";
import { BlogPost } from "@/components";
import { Loading } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Profile: NextPage = () => {
  const { user } = useUser();

  if (!user) return <div>please sign in to access this page</div>;

  const { data, isLoading } = api.post.getUserPosts.useQuery();
  if (isLoading) return <Loading as="page" />;

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
      <>
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
        <div className=" flex w-full flex-col gap-8  p-2">
          {data &&
            data.map((post): JSX.Element => {
              return <BlogPost key={post.post.id} {...post} />;
            })}
        </div>
      </>
    </>
  );
};

export default Profile;
