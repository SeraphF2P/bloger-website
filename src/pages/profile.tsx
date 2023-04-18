import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { Container } from "@/components";
import { type NextPage } from "next";

const Profile: NextPage = ({}) => {
  const { user } = useUser();
  if (!user) return null;
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
        <div>
          <div className=" relative h-20 w-20">
            <Image
              fill
              src={user.profileImageUrl}
              alt={`${user.username}'s profile picture`}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
