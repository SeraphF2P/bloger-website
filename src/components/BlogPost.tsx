import { CommentsSec } from ".";
import { formatRelativeDate } from "@/lib/formatter";
import { toast } from "@/lib/myToast";
import { AlertModal, Btn, Icons } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion as m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

const createlikeSectionCaption = ({
	isLiked,
	likesCount,
}: {
	likesCount: number;
	isLiked: boolean;
}) => {
	if (likesCount > 0) {
		if (isLiked && likesCount == 1) {
			return "you";
		} else if (isLiked && likesCount > 1) {
			return `you and ${likesCount - 1} other liked this post`;
		} else {
			return `${likesCount} users have liked this post`;
		}
	}
};
const BlogPost: FC<BlogPostType> = ({ auther, ...props }) => {
	const ctx = api.useContext();
	const auth = useUser();
	const { isLoading: isDeleting, mutate: remove } = api.post.delete.useMutation(
		{
			onSuccess: () => {
				void ctx.post.getAll.invalidate();
				void ctx.user.getUserPosts.invalidate();
				toast({
					type: "success",
					message: "deleted successfully",
				});
			},
			onError: () => {
				toast({
					type: "error",
					message: "somthing went wrong try again later",
				});
			},
		}
	);
	return (
		<div
			key={props.id}
			className=" font-outfit   w-full rounded bg-card shadow p-2"
		>
			<div className=" flex">
				<Link
					href={`/profile/${auther.id}`}
					className="relative h-20 w-20 rounded-sm"
				>
					<Image
						src={auther.profileImageUrl}
						alt={`${auther.username}'s profile image`}
						fill
						sizes="80px"
						priority
						blurDataURL="/male-avatar.webp"
						placeholder="blur"
					/>
				</Link>
				<div className=" flex h-20 flex-grow  flex-col justify-between p-2">
					<div className="">
						<h3 className="m-0 capitalize">{props.title}</h3>
					</div>
					<div className=" flex justify-between">
						<p>{auther.username}</p>
						<p>{formatRelativeDate(props.createdAt)}</p>
					</div>
				</div>
			</div>

			<div className="   min-h-[100px] bg-theme p-4 ">
				<p>{props.content}</p>
			</div>
			<LikesSec
				likeSectionCaption={createlikeSectionCaption({
					isLiked: props.isLiked,
					likesCount: props.likesCount,
				})}
			/>
			<div className="   flex items-center justify-between">
				<LikeBtn
					auth={auth}
					postId={props.id}
					autherId={auther.id}
					isLiked={props.isLiked}
				/>
				<CommentsSec
					postId={props.id}
					autherId={props.autherId}
					likesCount={props.likesCount}
					variant="ghost"
					className=" flex justify-center items-center gap-1 flex-grow p-2 text-lg font-semibold "
				>
					comment
					<Icons.chatbubble width="16" height="16" />
				</CommentsSec>
				{auth.isSignedIn && auth.user.id == auther.id && (
					<AlertModal
						disabled={isDeleting}
						onConfirm={() => remove(props.id)}
						variant="ghost"
						className="  flex-grow p-2 text-lg font-semibold "
					>
						delete
					</AlertModal>
				)}
			</div>
		</div>
	);
};

export default BlogPost;

function LikeBtn({
	isLiked,
	postId,
	autherId,
}: {
	isLiked: boolean;
	postId: string;
	autherId: string;
	auth: ReturnType<typeof useUser>;
}) {
	const ctx = api.useContext();
	const optimisticallyChangsLikedState = () => {
		void ctx.post.getAll.setInfiniteData({}, (oldData) => {
			if (!oldData) return;
			return {
				pageParams: oldData.pageParams,
				pages: oldData.pages.map((page) => {
					return {
						nextCursor: page.nextCursor,
						posts: page.posts.map((post) => {
							if (post.id == postId) {
								const { isLiked, likesCount, ...rest } = post;
								return {
									isLiked: !isLiked,
									likesCount: isLiked ? likesCount - 1 : likesCount + 1,
									...rest,
								};
							}
							return post;
						}),
					};
				}),
			};
		});
	};
	const { mutate: like } = api.post.like.useMutation({
		onMutate: optimisticallyChangsLikedState,
		onSettled: (res) => {
			if (res == false) {
				optimisticallyChangsLikedState();
				toast({ message: "somting went wrong", type: "error" });
			}
		},
		onError: () => {
			optimisticallyChangsLikedState();
			toast({ message: "somting went wrong", type: "error" });
		},
	});

	return (
		<Btn
			onClick={() => {
				like({ postId, autherId });
			}}
			className=" flex justify-center items-center  flex-grow  p-2 text-lg font-semibold "
			variant="ghost"
		>
			<AnimatePresence initial={false} mode="popLayout">
				{isLiked ? (
					<m.span
						key={"heart-icon-postId:" + postId}
						initial={{
							x: 8,
							opacity: 0,
						}}
						animate={{
							x: 0,

							opacity: 1,
						}}
						exit={{
							x: 8,
							opacity: 0,
						}}
					>
						<Icons.heart
							className={`w-7 h-7 relative transition-transform fill-red-400 hover:scale-105 `}
						/>
					</m.span>
				) : (
					<m.span
						key={"like-btn-postId:" + postId}
						initial={{
							x: -8,
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						exit={{
							x: -8,
							opacity: 0,
						}}
					>
						like
					</m.span>
				)}
			</AnimatePresence>
		</Btn>
	);
}
type LikeSecPropsType = {
	likeSectionCaption?: string;
};
function LikesSec({ likeSectionCaption }: LikeSecPropsType) {
	return (
		<div className=" relative h-6 text-sm text-revert-theme">
			{likeSectionCaption && (
				<span className="  px-2">{likeSectionCaption}</span>
			)}
			<hr className=" border-revert-theme/20 absolute top-full  left-4 right-4 " />
		</div>
	);
}
