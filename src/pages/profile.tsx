import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { FC } from "react";

interface profileProps {}

const profile: FC<profileProps> = ({}) => {
  const { user } = useUser();
if(!user) return null;
  return (
    <>
      <Head>
        <title>{user?.username} profile</title>
        <meta name="auther" content={user.username || `${user.firstName} ${user.lastName}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default profile;
