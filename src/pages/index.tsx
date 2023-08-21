import { BlogPost } from "@/components";
import { Loading } from "@/ui";
import { type NextPage } from "next";
import Head from "next/head";
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
      <section className=" text-revert-theme flex flex-col gap-4">
        {posts &&
          posts.map((props): JSX.Element => {
            return <BlogPost key={props.post.id} {...props} />;
          })}
      </section>
    </>
  );
};

export default Home;
