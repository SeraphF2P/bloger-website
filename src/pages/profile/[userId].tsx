import { variants } from "../../lib/cva";
import {
	AddFriend,
	BlogPost,
	ConfirmFriendRequestBtn,
	ScrollEndIndecator,
} from "@/components/index";
import { toast } from "@/lib/myToast";
import { Container, Icons, Loading } from "@/ui";
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
import Error from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
	if (isLoading) {
		return (
			<Loading.SkeletonPage
				count={4}
				className=" flex w-full flex-col gap-8  p-2"
			/>
		);
	}
	const posts = postPages?.pages.flatMap((page) => page.posts);

	if (!posts || posts?.length == 0) {
		return (
			<div className=" min-h-40 flex  w-full flex-col items-center justify-center rounded bg-slate-300 p-8 dark:bg-slate-500">
				<Icons.error className=" w-40  " />
				<h3 className=" capitalize">user dont have any post</h3>
			</div>
		);
	}

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
		{ userId, limit: 5 },
		{
			getNextPageParam: (lastpage) => lastpage.nextCursor,
			keepPreviousData: true,
		}
	);
	if (!auther) return <Error statusCode={404} withDarkMode />;

	const MainBtn = () => {
		const isUserAuther = auth.isSignedIn && auther.id == auth.user?.id;
		const status = isUserAuther
			? "isUserAuther"
			: auther.isFriend
			? "isFriend"
			: auther.hasAfriendRequest
			? "hasAfriendRequest"
			: "AddFriend";
		const config = {
			isUserAuther: null,
			isFriend: (
				<Link
					className={variants({
						variant: "fill",
						className: " capitalize px-4 py-2",
					})}
					href={`/chat/${[auther.id, auth.user?.id].sort().join("--")}`}
				>
					message
				</Link>
			),
			hasAfriendRequest: <ConfirmFriendRequestBtn autherId={auther.id} />,
			AddFriend: <AddFriend isFriend={auther.isFriend} autherId={auther.id} />,
		};
		return config[status];
	};
	return (
		<>
			<Head>
				<title>{auther.username} Profile</title>
				<meta name="auther" content={auther.username} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<section className=" pb-[51px] ">
					<div className="  h-40 w-full bg-primary   relative">
						<div className=" absolute  -bottom-1/3 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full ">
							<Image
								fill
								src={auther.profileImageUrl}
								alt={`${auther.username}'s profile picture`}
							/>
						</div>
					</div>
				</section>
				<div className=" w-full p-2  text-center">
					<h1>{auther.username}</h1>
					<div className="  flex gap-2  justify-center w-full p-2">
						{isFetched && <MainBtn />}
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
