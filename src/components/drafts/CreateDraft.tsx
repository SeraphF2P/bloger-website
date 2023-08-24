"use client";

import { toast } from "../../lib/myToast";
import { Btn } from "@/ui";
import { api } from "@/utils/api";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion as m } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";

type formValuesType = { title: string; content: string };

const CreateDraft = () => {
  const ctx = api.useContext();
  const [open, setopen] = useState(false);
  const { register, handleSubmit, formState, reset } =
    useForm<formValuesType>();

  const { errors } = formState;

  const { mutate, isLoading: isValidating } = api.post.createDraft.useMutation({
    onSuccess: () => {
      void ctx.post.getUserDrafts.invalidate();
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
    <Dialog.Root open={open} onOpenChange={setopen}>
      <Dialog.Trigger asChild>
        <Btn className=" fixed bottom-6 left-2/3 -translate-x-1/2 rounded px-8 py-4 text-xl capitalize md:left-[60%]">
          create
        </Btn>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className=" data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout   opacity-0 flex fixed inset-0  items-center justify-center backdrop-blur-sm dark:bg-gray-700/40">
          <Dialog.Content asChild>
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
                <Dialog.Close asChild>
                  <Btn className="  px-4 py-2 ">close</Btn>
                </Dialog.Close>

                <Btn
                  type="submit"
                  disabled={isValidating}
                  className="  px-4 py-2 "
                >
                  submit
                </Btn>
              </div>
            </form>
          </Dialog.Content>
          <AnimatePresence mode="popLayout">
            {errors.title?.message || errors.content?.message ? (
              <m.div
                initial={{ y: "300px", scale: 0.1 }}
                exit={{ y: "300px", scale: 0.1 }}
                animate={{ y: 0, scale: 1 }}
                className="  grid text-center bg-red-400 aspect-square  min-h-20 max-h-28  min-w-20 max-w-28 absolute bottom-8 rounded-full"
              >
                <span className=" m-auto ">
                  {errors.title?.message || errors.content?.message}
                </span>
              </m.div>
            ) : null}
          </AnimatePresence>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateDraft;
