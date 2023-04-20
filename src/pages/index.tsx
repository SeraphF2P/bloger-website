import { type NextPage } from "next";
import Head from "next/head";

import { BlogPost, Container } from "@/components";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: posts } = api.post.getAll.useQuery();
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
      <Container>
        {posts &&
          posts.map(({ auther, post }): JSX.Element => {
            return <BlogPost key={post.id} auther={auther} post={post} />;
          })}
      </Container>
    </>
  );
};

export default Home;
