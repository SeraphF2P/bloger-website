import { type FC } from "react";
import { formatRelativeDate } from "@/lib/formatter";
import { api, type RouterOutputs } from "../utils/api";
import Image from "next/image";
import { Btn, AlertModal } from "@/components";
import { useUser } from "@clerk/nextjs";
import { toast } from "../lib/myToast";
import Link from "next/link";

type Post = RouterOutputs["post"]["getAll"][number];

const BlogPost: FC<Post> = ({ auther, post, likedBy }) => {
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
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      toast({
        type: "error",
        message: err.message,
      });
    },
  });
  const validateLikes = () => {
    if (likedBy.length > 0) {
      if (user && likedBy.some((item) => item.autherId == user.id)) {
        if (likedBy.length == 1) return user.username || "you";
        return `you and ${likedBy.length} other liked this post`;
      } else {
        return likedBy.length;
      }
    }
  };
  return (
    <div
      key={post.id}
      className="  prose-invert w-full rounded bg-slate-200 p-2"
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
          <div className="prose">
            <h3 className="m-0 capitalize">{post.title}</h3>
          </div>
          <div className="prose flex justify-between">
            <p className="m-0">{auther.username}</p>
            <p className="m-0 ">{formatRelativeDate(post.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className=" prose  min-h-[100px] bg-slate-300 p-4 ">
        <p>{post.content}</p>
      </div>
      <div className=" px-2 h-6   text-sm  text-black">
        {validateLikes()}
      </div>
      <div className=" prose  flex items-center justify-between">
        <Btn
          onClick={() => like(post.id)}
          className=" flex-grow p-2 text-lg font-semibold "
          variant="ghost"
        >
          like
        </Btn>
        <Btn className=" flex-grow p-2 text-lg font-semibold " variant="ghost">
          comment
        </Btn>
        {user && user.id == auther.id && (
          <AlertModal
            disabled={isDeleting}
            onConfirm={() => remove(post.id)}
            className=" flex-grow p-2 text-lg font-semibold "
          >
            delete
          </AlertModal>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
