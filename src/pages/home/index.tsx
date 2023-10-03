import { CreatePost } from "@/components/home";
import { BlogPost, NoContent, ScrollEndIndecator } from "@/components/index";
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
	const posts = data?.pages.flatMap((page) => page.posts);
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
				<CreatePost />
				{isLoading && (
					<Loading.SkeletonPage
						className=" relative top-8 w-full items-center flex flex-col gap-4"
						count={4}
					/>
				)}
				{posts ? (
					posts.map((props): JSX.Element => {
						return <BlogPost key={props.id} {...props} />;
					})
				) : (
					<NoContent />
				)}
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
