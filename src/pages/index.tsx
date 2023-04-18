import { type NextPage } from "next";
import Head from "next/head";

import { Container } from "@/components";
import { api, type RouterOutputs } from "~/utils/api";
import { formatRelativeDate } from "../lib/formatter";
import Image from "next/image";
type Post = RouterOutputs["post"]["getAll"][number];

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
          posts.map(({ auther, post }: Post): JSX.Element => {
            return (
              post && (
                <div className="  prose-invert w-full rounded bg-slate-200 p-2">
                  <div className=" flex">
                    <div className="relative h-20 w-20 rounded-sm">
                      <Image
                        src={auther.profileImageUrl}
                        alt={`${auther.username}'s profile image`}
                        fill
                        priority
                        blurDataURL="/male-avatar.webp"
                        placeholder="blur"
                      />
                    </div>
                    <div className=" flex h-20 flex-grow  flex-col justify-between p-2">
                      <div className="prose">
                        <h3 className="m-0 capitalize">{post.title}</h3>
                      </div>
                      <div className="prose flex justify-between">
                        <p className="m-0">{auther.username}</p>
                        <p className="m-0 ">
                          {formatRelativeDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" prose  min-h-[100px] bg-slate-300 p-4 ">
                    <p>{post.content}</p>
                  </div>
                </div>
              )
            );
          })}
      </Container>
    </>
  );
};

export default Home;
