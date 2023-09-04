import { BlogPost, ScrollEndIndecator } from "@/components/index";
import { toast } from "@/lib/myToast";
import { Btn, Container, Icons, Loading, Modale, NextImage } from "@/ui";
import { api, type RouterOutputs } from "@/utils/api";
import { ssgHelper } from "@/utils/ssgHelper";
import { useUser } from "@clerk/nextjs";
import type {
	GetStaticPaths,
	GetStaticPropsContext,
	InferGetStaticPropsType,
} from "next";
import Error from "next/error";
import Head from "next/head";
import Image from "next/image";
import type { FC } from "react";
import { useState } from "react";

type User = RouterOutputs["user"]["getUserProfile"];
function PostsSection({ auther }: { auther: User }) {
	const { data, isLoading, hasNextPage, fetchNextPage } =
		api.user.getUserPosts.useInfiniteQuery(
			{ userId: auther.id, limit: 5 },
			{
				getNextPageParam: (lastpage) => lastpage.nextCursor,
				keepPreviousData: true,
			}
		);
	if (isLoading) {
		return (
			<Loading.SkeletonPage
				count={4}
				className=" flex w-full flex-col gap-8  p-2"
			/>
		);
	}
	const posts = data?.pages.flatMap((page) => page.posts);

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
function AddFriend({ autherId }: { autherId: string }) {
	const auth = useUser();
	const [isSent, setIsSent] = useState(false);
	const friendRequest = api.notification.create.useMutation({
		onMutate: () => {
			setIsSent((prev) => !prev);
		},
		onError: () => {
			setIsSent((prev) => !prev);
			toast({ message: "some thing went wrong", type: "error" });
		},
	});
	if (!auth.user || auth.user?.id == autherId) return null;
	return (
		<Btn
			disabled={friendRequest.isLoading}
			onClick={() =>
				friendRequest.mutate({
					from: auth.user.id,
					to: autherId,
					type: "friendrequest",
				})
			}
			className="px-4 py-2 "
		>
			{isSent ? "cancel request" : "send friend request"}
		</Btn>
	);
}
// function FriendList({ friends }: { friends: AutherType[] }) {
// 	return (
// 		<Modale>
// 			<Modale.Btn variant="outline" className="  px-4 py-2 ">
// 				friends list
// 			</Modale.Btn>
// 			<Modale.Content className="translate-y-full p-2 [--fadein-duration:0.7s] z-50 relative bg-theme dark:bg-theme backdrop-blur-sm mn:max-w-screen-mn w-full shadow mx-4 h-full">
// 				{friends &&
// 					friends.map((friend) => {
// 						return (
// 							<div
// 								className=" flex p-2 rounded-sm bg-slate-50/10 backdrop-blur w-full gap-2 items-center "
// 								key={friend.id}
// 							>
// 								<NextImage
// 									className=" h-20 w-20"
// 									src={friend.profileImageUrl}
// 									alt={friend.username}
// 								/>
// 								<div>
// 									<h2>{friend.username}</h2>
// 								</div>
// 							</div>
// 						);
// 					})}
// 			</Modale.Content>
// 		</Modale>
// 	);
// }
const Profile: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
	userId,
}) => {
	const auth = useUser();
	const { data: auther } = api.user.getUserProfile.useQuery(userId);
	if (!auther) return <Error statusCode={404} withDarkMode />;

	const isFriend = auther.friends.some((f) => f.id == auth.user?.id);
	const isUserAuther = auth.isSignedIn && auther.id == auth.user?.id;
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
						{/* <FriendList friends={auther.friends} /> */}
						{isUserAuther ? null : isFriend ? (
							<Btn>defriend</Btn>
						) : (
							<AddFriend autherId={auther.id} />
						)}
					</div>
				</div>
				<PostsSection auther={auther} />
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
