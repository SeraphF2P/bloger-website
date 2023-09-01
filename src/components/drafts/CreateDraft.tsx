"use client";

import { toast } from "@/lib/myToast";
import { Btn, Modale } from "@/ui";
import { api } from "@/utils/api";
import { useState } from "react";
import { useForm } from "react-hook-form";

type formValuesType = { title: string; content: string };

const CreateDraft = () => {
  const ctx = api.useContext();
  const [open, setopen] = useState(false);
  const { register, handleSubmit, reset } = useForm<formValuesType>();

  const { mutate, isLoading: isValidating } = api.post.createDraft.useMutation({
    onSuccess: () => {
      void ctx.user.getUserDrafts.invalidate();
      reset();
      toast({ type: "success", message: "new draft has been created" });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors[0] || [
        "somthing went wrong",
      ];
      toast({
        type: "error",
        message: errorMessage[0],
      });
    },
    onSettled: () => {
      setopen(false);
    },
  });

  const onSubmit = (data: formValuesType) => {
    mutate(data);
  };
  return (
    <Modale open={open} onOpenChange={setopen}>
      <Modale.Btn className=" fixed bottom-6 left-2/3 -translate-x-1/2 rounded px-8 py-4 text-xl capitalize md:left-[60%]">
        create
      </Modale.Btn>

      <Modale.Content asChild>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className=" data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout w-[300px] translate-y-16 opacity-0   relative flex gap-4 flex-col"
        >
          <input
            className=" placeholder:text-revert-theme w-full rounded border-0 bg-slate-100  dark:bg-gray-900"
            type="text"
            placeholder="title"
            {...register("title", {
              required: "title is required",
              minLength: {
                message: "min title is 3 charcter",
                value: 3,
              },
              maxLength: {
                message: "max title is 24 charcter",
                value: 24,
              },
            })}
          />
          <textarea
            className=" placeholder:text-revert-theme min-h-[240px]  resize-none w-full rounded border-0 bg-slate-100  dark:bg-gray-900 "
            placeholder="content"
            {...register("content", {
              required: "content is required",
              minLength: {
                message: "min content is 3 charcter",
                value: 3,
              },
              maxLength: {
                message: "max content is 500 charcter",
                value: 500,
              },
            })}
          />
          <div className=" w-full flex justify-between">
            <Modale.Close
              variant="outline"
              className=" origin-right  px-4 py-2 "
            >
              close
            </Modale.Close>

            <Btn type="submit" disabled={isValidating} className="  px-4 py-2 ">
              submit
            </Btn>
          </div>
        </form>
      </Modale.Content>
    </Modale>
  );
};

export default CreateDraft;
