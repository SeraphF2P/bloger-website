import { useUser } from "@clerk/nextjs";
import Head from "next/head";

const Profile = ({}) => {
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
    </>
  );
};

export default Profile;
