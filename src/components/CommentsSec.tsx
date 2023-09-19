import AddComment from "./AddComment";
import ScrollEndIndecator from "./ui/ScrollEndIndecator";
import { Icons, Loading, Modale, NextImage, type BtnProps } from "@/ui";
import { api } from "@/utils/api";
import { useLayoutEffect, useRef } from "react";

// type CommentProps = RouterOutputs["comment"]["getComments"];
interface CommentsSecPropsType extends BtnProps {
	postId: string;
	autherId: string;
	likesCount: number;
}

const CommentSection = ({
	postId,
	autherId,
	likesCount,
	...props
}: CommentsSecPropsType) => {
	return (
		<Modale>
			<Modale.Btn {...props} />
			<Modale.Content className="translate-y-full [--fadein-duration:0.7s] z-50 relative bg-theme dark:bg-theme backdrop-blur-sm mn:max-w-screen-mn w-full shadow mx-4 h-full">
				<div className=" flex justify-between sticky top-0 border-0 border-b-[1px] border-revert-theme w-full h-10">
					<div className=" flex justify-center items-center px-4">
						{likesCount} likes on this post
					</div>
					<Modale.Close className=" w-16 h-full ">
						<Icons.arrowRight className="w-6 h-6 " />
					</Modale.Close>
				</div>
				<Comments postId={postId} />
				<AddComment postId={postId} autherId={autherId} />
			</Modale.Content>
		</Modale>
	);
};

const Comments = ({ postId }: { postId: string }) => {
	const { data, isLoading, fetchNextPage, hasNextPage } =
		api.comment.getComments.useInfiniteQuery(
			{ postId },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);
	if (isLoading)
		return (
			<Loading.SkeletonPage
				className="pb-20 p-4 flex justify-start items-start flex-col gap-8 overflow-y-scroll remove-scroll-bar  h-full"
				count={4}
			/>
		);
	if (!data) return null;
	const comments = data?.pages.flatMap((page) => page.comments);
	if (comments.length === 0 && !comments) {
		return <p> be the first on to comment on this post</p>;
	}
	return (
		<section className=" pb-20 p-4 flex justify-start items-start flex-col gap-8 overflow-y-scroll remove-scroll-bar  h-full">
			{comments.map(({ id, auther, content }) => (
				<div key={id} className=" max-w-full    ">
					<div className=" flex gap-2 items-center">
						<NextImage
							src={auther.profileImageUrl}
							className="  rounded-full overflow-hidden h-16 w-16"
							alt="profile pic"
						/>
						<h3>{auther.username}</h3>
					</div>
					<ExtendableContent content={content} />
				</div>
			))}
			<ScrollEndIndecator
				key={"scrollEnd"}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage || false}
			>
				{hasNextPage && <Loading.SkelatonPost />}
			</ScrollEndIndecator>
		</section>
	);
};
const ExtendableContent = ({ content }: { content: string }) => {
	const paragraphRef = useRef<HTMLParagraphElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useLayoutEffect(() => {
		const pTag = paragraphRef.current;
		const inputTag = inputRef.current;
		if (!pTag || !inputTag) return;
		if (pTag.scrollHeight - pTag.offsetHeight <= 0) {
			inputTag.style.display = "none";
		}
	}, []);
	return (
		<div className=" flex flex-col-reverse m-2">
			<input
				ref={inputRef}
				className=" peer whitespace-nowrap max-w-min hover:bg-primary/30 transition-colors before:content-['see_more'] before:checked:content-['see_less'] cursor-pointer px-4 py-2 rounded appearance-none  "
				type="checkbox"
			/>
			<p
				ref={paragraphRef}
				className=" peer-checked:max-h-none  overflow-hidden max-h-[calc(1em_*_4_+_16px)] max-w-[65ch] break-words rounded bg-revert-theme/10 p-2"
			>
				{content}
			</p>
		</div>
	);
};
export default CommentSection;
