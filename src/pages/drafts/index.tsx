import { CreateDraft } from "./(component)";
import { formatRelativeDate } from "@/lib/formatter";
import { toast } from "@/lib/myToast";
import { AlertModal, Btn, Icons, Loading } from "@/ui";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const Drafts: NextPage = () => {
  const ctx = api.useContext();
  const { user } = useUser();
  if (!user) return <div>please sign in to access this page</div>;
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
    <section className=" flex flex-col gap-4">
      {drafts?.length == 0 && (
        <div className=" min-h-40 flex  w-full flex-col items-center justify-center rounded bg-slate-300 p-8 dark:bg-slate-500">
          <Icons.error className=" w-40  " />

          <h2>you dont have any drafts</h2>
        </div>
      )}
      {!!drafts &&
        drafts?.map(({ id, content, createdAt, title }): JSX.Element => {
          return (
            <div
              key={id}
              className=" flex w-full  rounded bg-slate-300 dark:bg-slate-700  p-2"
            >
              <div className=" flex w-full flex-col  p-2">
                <div className=" flex justify-between p-2">
                  <h3 className="  capitalize">{title}</h3>
                  <p>{formatRelativeDate(createdAt)}</p>
                </div>
                <div className="   bg-theme p-4 ">
                  <p className=" line-clamp-5 ">{content}</p>
                </div>
                <div className=" flex justify-between p-2">
                  <AlertModal
                    onConfirm={() => remove(id)}
                    disabled={isDeleting}
                    variant="fill"
                    className=" [--variant:#c33]  px-4 py-2"
                  >
                    delete
                  </AlertModal>
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
    </section>
  );
};

export default Drafts;
