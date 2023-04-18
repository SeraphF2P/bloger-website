import { type NextPage } from "next";
import Head from "next/head";

import { Container } from "@/components";
import { api, type RouterOutputs } from "~/utils/api";
import { formatRelativeDate } from "../lib/formatter";
type Post = RouterOutputs["post"]["getAll"][number];

const Blog = ({ auther, post }: Post) => {
  return (
    <div className="  prose-invert w-full rounded bg-slate-200 p-2">
      <div className=" flex">
        <div className="relative h-20 w-20 rounded-sm bg-red-500">
          <img
            src={auther.profileImageUrl}
            className="absolute  inset-0 max-w-full"
            alt={`${auther.username} profile image`}
          />
        </div>
        <div className=" flex h-20 flex-grow  flex-col justify-between p-2">
          <div className="prose">
            <h3 className="m-0 capitalize">{post.title}</h3>
          </div>
          <div className="prose flex justify-between">
            <p className="m-0">{auther.username}</p>
            <p className="m-0 ">{formatRelativeDate(post.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className=" prose  min-h-[100px] bg-slate-300 p-4 ">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: posts } = api.post.getAll.useQuery();
  return (
    <>
      <Head>
        <title>Bloger</title>
        <meta name="description" content="blog website created using T3 stack" />
        <meta name="auther" content="jafer ali" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        {posts &&
          posts.map((post): JSX.Element => {
            return post && <Blog {...post} key={post.post.id}></Blog>;
          })}
      </Container>
    </>
  );
};

export default Home;
