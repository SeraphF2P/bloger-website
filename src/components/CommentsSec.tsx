import ScrollEndIndecator from "./ui/ScrollEndIndecator";
import { toast } from "@/lib/myToast";
import { Btn, Icons, Modale, NextImage, type BtnProps, Loading } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";

// type CommentProps = RouterOutputs["comment"]["getComments"];
interface CommentsSecPropsType extends BtnProps {
  postId: string;
  likesCount: number;
}

const CommentSection = ({
  postId,
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
        <AddComment postId={postId} />
      </Modale.Content>
    </Modale>
  );
};
type formValuesType = {
  postId: string;
  content: string;
};
const AddComment = ({ postId }: { postId: string }) => {
  const { isSignedIn } = useUser();
  const ctx = api.useContext();
  const { register, handleSubmit, resetField } = useForm<formValuesType>();
  const { mutate, isLoading: isValidating } =
    api.comment.createComment.useMutation({
      onSuccess: () => {
        resetField("content");
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

  const submitHandler = (data: formValuesType) => {
    mutate(data);
  };
  return (
    <div className="    absolute bottom-0 left-0  h-10   w-full bg-gray-100 dark:bg-gray-900">
      {isSignedIn ? (
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitHandler)}
          className=" flex w-full h-full   items-center"
        >
          <input
            placeholder="write a comment..."
            className=" form-input h-10 w-full"
            type="text"
            {...register("content", {
              required: true,
              minLength: {
                message: "min comment is 1 charcter",
                value: 1,
              },
            })}
          />
          <input type="hidden" value={postId} {...register("postId")} />
          <Btn
            disabled={isValidating}
            type="submit"
            shape="circle"
            className=" m-2  h-8 w-8 "
          >
            <Icons.send className=" w-4 h-4 " />
          </Btn>
        </form>
      ) : (
        <p className=" px-4 py-2">
          you cannot comment on this post login or try again later
        </p>
      )}
    </div>
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
          <div className=" m-2">
            <p className=" line-clamp-4 rounded bg-revert-theme/10 p-2">
              {content}
            </p>
          </div>
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

export default CommentSection;
