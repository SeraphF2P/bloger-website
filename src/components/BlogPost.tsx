import { formatRelativeDate } from "@/lib/formatter";
import { toast } from "@/lib/myToast";
import { AlertModal, Btn, Icons, ToggleBtn } from "@/ui";
import { api, type RouterOutputs } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion as m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, type FC } from "react";

type Post = RouterOutputs["post"]["getAll"][number];

const BlogPost: FC<Post> = ({ auther, post, likesCount, isLiked }) => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { isLoading: isDeleting, mutate: remove } = api.post.delete.useMutation(
    {
      onSuccess: () => {
        void ctx.post.getAll.invalidate();
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
  const { mutate: like } = api.post.like.useMutation({
    onSuccess: () => {
      void ctx.post.invalidate();
    },
    onError: (err) => {
      toast({
        type: "error",
        message: err.message,
      });
    },
  });
  const validateLikes = useMemo(() => {
    if (likesCount > 0) {
      if (user && isLiked) {
        if (likesCount == 1) return "you";
        return `you and ${likesCount - 1} other liked this post`;
      } else {
        return likesCount;
      }
    }
  }, [isLiked, likesCount, user]);
  return (
    <div
      key={post.id}
      className="   w-full rounded bg-slate-300 dark:bg-slate-700 shadow p-2"
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
            <h3 className="m-0 capitalize">{post.title}</h3>
          </div>
          <div className=" flex justify-between">
            <p>{auther.username}</p>
            <p>{formatRelativeDate(post.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="   min-h-[100px] bg-theme p-4 ">
        <p>{post.content}</p>
      </div>
      <div className=" relative h-6 text-sm text-revert-theme">
        <span className="  px-2">{validateLikes}</span>
        <hr className=" border-revert-theme/20 absolute top-full  left-4 right-4 " />
      </div>
      <div className="   flex items-center justify-between">
        <LikeBtn onClick={() => like(post.id)} />
        <Btn className=" flex-grow p-2 text-lg font-semibold " variant="ghost">
          comment
        </Btn>
        {user && user.id == auther.id && (
          <AlertModal
            disabled={isDeleting}
            onConfirm={() => remove(post.id)}
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

function LikeBtn({ onClick }: { onClick: () => void }) {
  return (
    <ToggleBtn
      onClick={onClick}
      className=" flex justify-center items-center  flex-grow  p-2 text-lg font-semibold "
      variant="ghost"
      whenToggled=""
      defaultToggleState={false}
    >
      {({ isToggled }) => (
        <>
          <AnimatePresence initial={false} mode="popLayout">
            {isToggled && (
              <m.span
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
            )}
          </AnimatePresence>
          <AnimatePresence initial={false} mode="popLayout">
            {!isToggled && (
              <m.span
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
        </>
      )}
    </ToggleBtn>
  );
}
