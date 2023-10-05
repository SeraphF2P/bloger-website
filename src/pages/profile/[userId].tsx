import { FriendshipHandlerBtn } from "../../components/profile";
import { BlogPost, NoContent, ScrollEndIndecator } from "@/components/index";
import { toast } from "@/lib/myToast";
import { Container, ErrorPages, Loading, NextImage } from "@/ui";
import { api, type RouterOutputs } from "@/utils/api";
import { ssgHelper } from "@/utils/ssgHelper";
import { useUser } from "@clerk/nextjs";
import type {
	FetchNextPageOptions,
	InfiniteData,
	InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import type {
	GetStaticPaths,
	GetStaticPropsContext,
	InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import type { FC } from "react";

type User = RouterOutputs["user"]["getUserProfile"];
type PostPagesType = RouterOutputs["user"]["getUserPosts"];
function PostsSection({
	auther,
	isLoading,
	postPages,
	hasNextPage,
	fetchNextPage,
}: {
	auther: User;
	isLoading: boolean;
	postPages: InfiniteData<PostPagesType> | undefined;
	hasNextPage: boolean | undefined;
	fetchNextPage: (
		options?: FetchNextPageOptions | undefined
	) => Promise<InfiniteQueryObserverResult<PostPagesType>>;
}) {
	if (isLoading)
		return (
			<Loading.SkeletonPage
				count={4}
				className=" flex w-full flex-col gap-8  p-2"
			/>
		);

	const posts = postPages?.pages.flatMap((page) => page.posts);

	if (!posts || posts?.length == 0) return <NoContent />;

	return (
		<>
			{posts.map((post) => {
				return <BlogPost key={post.id} auther={auther} {...post} />;
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
		</>
	);
}

const Profile: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
	userId,
}) => {
	const auth = useUser();
	const { data: auther, isFetched } = api.user.getUserProfile.useQuery(userId);
	const {
		data: postPages,
		isLoading,
		hasNextPage,
		fetchNextPage,
	} = api.user.getUserPosts.useInfiniteQuery(
		{ userId },
		{
			getNextPageParam: (lastpage) => lastpage.nextCursor,
		}
	);
	if (!auther) return <ErrorPages status={404} />;

	return (
		<>
			<Head>
				<title>{auther.username} Profile</title>
				<meta name="auther" content={auther.username} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<section className=" pb-[51px] ">
					<div className="  h-40 w-full bg-primary relative">
						<NextImage
							className=" absolute border-2 border-revert-theme  -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full "
							sizes="144px 144px"
							src={auther.profileImageUrl}
							alt={`${auther.username}'s profile picture`}
						/>
					</div>
				</section>
				<div className=" w-full p-2 flex flex-col gap-2  text-center">
					<h1>{`${auther.firstName || ""} ${auther.lastName || ""}`}</h1>
					<p>{auther.username}</p>
					<div className="  flex gap-2  justify-center w-full p-2">
						{isFetched && !isLoading && (
							<FriendshipHandlerBtn
								userId={auth.user?.id || ""}
								autherId={auther.id}
								isFriend={auther.isFriend}
								isSignedIn={auth.isSignedIn || false}
								hasAfriendRequest={auther.hasAfriendRequest}
							/>
						)}
					</div>
				</div>
				<PostsSection
					isLoading={isLoading}
					hasNextPage={hasNextPage}
					postPages={postPages}
					fetchNextPage={fetchNextPage}
					auther={auther}
				/>
			</Container>
		</>
	);
};
export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};
export const getStaticProps = async (context: GetStaticPropsContext) => {
	const userId = context.params?.userId;
	if (typeof userId != "string") {
		return {
			redirect: {
				distination: "/",
			},
		};
	}
	const ssg = ssgHelper();
	await ssg.user.getUserProfile.prefetch(userId);
	return {
		props: {
			userId,
			trpcState: ssg.dehydrate(),
		},
	};
};

export default Profile;
