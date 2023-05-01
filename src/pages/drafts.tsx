import { type NextPage } from "next";

import { Btn, CreateDraft, Icons, Loading } from "@/components";
import { api } from "~/utils/api";
import { formatRelativeDate } from "../lib/formatter";
import { toast } from "../lib/myToast";

const Drafts: NextPage = () => {
  const ctx = api.useContext();

  const { data: drafts, isLoading } = api.post.getUserDrafts.useQuery();
  const { isLoading: isPublishing, mutate: publish } =
    api.post.publish.useMutation({
      onSuccess: () => {
        void ctx.post.getUserDrafts.invalidate();
        toast({
          type: "success",
          message: "published successfully",
        });
      },
      onError: () => {
        toast({
          type: "error",
          message: "somthing went wrong try again later",
        });
      },
    });
  const { isLoading: isDeleting, mutate: remove } = api.post.delete.useMutation(
    {
      onSuccess: () => {
        void ctx.post.getUserDrafts.invalidate();
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

  if (isLoading) return <Loading as="page" />;

  return (
    <>
      {drafts?.length == 0 && (
        <div className=" min-h-40 flex w-full flex-col items-center justify-center rounded bg-slate-300 p-8 dark:bg-slate-500">
          <Icons.error className=" w-40  " />

          <h2>you dont have any drafts</h2>
        </div>
      )}
      {!!drafts &&
        drafts?.map(({ id, content, createdAt, title }): JSX.Element => {
          return (
            <div
              key={id}
              className=" prose-invert flex w-full  rounded bg-slate-200 p-2"
            >
              <div className=" flex w-full flex-col  p-2">
                <div className="prose flex justify-between p-2">
                  <h3 className="m-0  capitalize">{title}</h3>
                  <p className="m-0 ">{formatRelativeDate(createdAt)}</p>
                </div>
                <div className=" prose  bg-slate-300 p-4 ">
                  <p className=" truncate">{content}</p>
                </div>
                <div className=" flex justify-between p-2">
                  <Btn
                    disabled={isDeleting}
                    onClick={() => remove(id)}
                    className=" px-4 py-2"
                  >
                    delete
                  </Btn>
                  <Btn
                    onClick={() => publish(id)}
                    disabled={isPublishing}
                    className=" px-4 py-2"
                  >
                    publish
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}

      <CreateDraft />
    </>
  );
};

export default Drafts;
