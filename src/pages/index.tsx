import { BlogPost, ScrollEndIndecator } from "@/components/index";
import { toast } from "@/lib/myToast";
import { Container, Loading } from "@/ui";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
	const { data, isLoading, fetchNextPage, hasNextPage } =
		api.post.getAll.useInfiniteQuery(
			{},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);
	if (isLoading)
		return (
			<Container>
				<Loading.SkeletonPage
					className="flex-col  w-full items-center flex gap-4"
					count={4}
				/>
			</Container>
		);
	const posts = data?.pages.flatMap((page) => page.posts);
	if (!posts || posts.length == 0) {
		return <>no post</>;
	}
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
			<Container className="text-revert-theme flex flex-col gap-4">
				{posts.map((props): JSX.Element => {
					return <BlogPost key={props.id} {...props} />;
				})}
				<ScrollEndIndecator
					hasNextPage={hasNextPage || false}
					fetchNextPage={fetchNextPage}
					onError={() => {
						toast({ message: "no more posts", type: "error" });
					}}
				>
					{hasNextPage && <Loading.SkelatonPost />}
				</ScrollEndIndecator>
			</Container>
		</>
	);
};

export default Home;
