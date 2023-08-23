"use client";

import { toast } from "../../../lib/myToast";
import { Btn } from "@/ui";
import { api } from "@/utils/api";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion as m, motion } from "framer-motion";
import { useForm } from "react-hook-form";

type formValuesType = { title: string; content: string };
const MotionPortal = motion(Dialog.Portal);
const CreateDraft = () => {
  const ctx = api.useContext();

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
  });

  const onSubmit = (data: formValuesType) => {
    mutate(data);
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Btn className=" fixed bottom-6 left-2/3 -translate-x-1/2 rounded px-8 py-4 text-xl capitalize md:left-[60%]">
          create
        </Btn>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className=" flex fixed inset-0  items-center justify-center backdrop-blur-sm dark:bg-gray-700/40">
          <Dialog.Content asChild>
            <m.form
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit(onSubmit)}
              className=" w-[300px]  relative flex gap-4 flex-col"
            >
              <input
                className=" w-full rounded border-0 bg-slate-100 placeholder:text-black dark:bg-gray-900"
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
                className=" min-h-[240px]  resize-none w-full rounded border-0 bg-slate-100 placeholder:text-black dark:bg-gray-900 "
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
            </m.form>
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
