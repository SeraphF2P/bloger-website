import { type NextPage } from "next";
import Head from "next/head";

import { BlogPost, Loading } from "@/components";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: posts, isLoading } = api.post.getAll.useQuery();
  if (isLoading) return <Loading as="page" />;
  return (
    <>
      <Head>
        <title>Bloger</title>
        <meta
          name="description"
          content="blog website created using T3 stack"
        />
        <meta name="auther" content="jafer ali" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {posts &&
          posts.map((props): JSX.Element => {
            return <BlogPost key={props.post.id} {...props} />;
          })}
      </>
    </>
  );
};

export default Home;
