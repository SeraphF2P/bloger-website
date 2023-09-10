import { toast } from "@/lib/myToast";
import { ContentInput } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

const AddComment = ({
	postId,
	autherId,
}: {
	postId: string;
	autherId: string;
}) => {
	const { isSignedIn } = useUser();
	const ctx = api.useContext();
	const { mutate, isLoading: isValidating } =
		api.comment.createComment.useMutation({
			onSuccess: () => {
				void ctx.comment.getComments.invalidate();
			},
			onError: (err) => {
				toast({
					type: "error",
					message:
						err.data?.zodError?.formErrors[0] ||
						"somthing went wrong try check your internet connection and try again later",
				});
			},
		});

	return (
		<ContentInput
			mutate={(content) => mutate({ content, postId, autherId })}
			isValidating={isValidating}
			fallBack={
				<>
					{isSignedIn && (
						<p className=" px-4 py-2">
							you cannot comment on this post login or try again later
						</p>
					)}
				</>
			}
		/>
	);
};

export default AddComment;
