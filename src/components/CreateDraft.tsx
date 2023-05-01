"use client";
import { Btn } from "@/components";
import { useRef, useState } from "react";
import { api } from "../utils/api";
import { useClickOutside, useScrollLock } from "../hooks";
import { toast } from "../lib/myToast";

const CreateDraft = () => {
  const [isOpen, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const inputSection = useRef(null);
  useClickOutside(inputSection, () => setOpen(false));

  const ctx = api.useContext();

  const { mutate, isLoading: isValidating } = api.post.createDraft.useMutation({
    onSuccess: () => {
      setTitle("");
      setContent("");
      setOpen(false);
      void ctx.post.getUserDrafts.invalidate();
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
  useScrollLock(isOpen);
  return (
    <>
      {isOpen ? (
        <div className="  fixed left-0 top-0  mx-auto flex h-screen w-full items-start  justify-center  bg-gray-700/20 pt-24 backdrop-blur-sm">
          <div
            ref={inputSection}
            className="  mt-10 flex w-[80%] max-w-xs flex-col gap-2  "
          >
            <input
              onChange={(e) => setTitle(e.target.value)}
              className=" rounded border-0 bg-slate-100 placeholder:text-black dark:bg-gray-900"
              min={1}
              max={30}
              type="text"
              name="title"
              placeholder="title"
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              className=" min-h-[240px]  resize-none rounded border-0 bg-slate-100 placeholder:text-black dark:bg-gray-900 "
              minLength={1}
              maxLength={500}
              name="content"
              placeholder="content"
            />
            <Btn
              disabled={isValidating}
              onClick={() => mutate({ content, title })}
              className="  px-4 py-2 "
            >
              submit
            </Btn>
          </div>
        </div>
      ) : (
        <Btn
          onClick={() => {
            setOpen(true);
          }}
          className=" fixed bottom-6 left-2/3 -translate-x-1/2 rounded px-8 py-4 text-xl capitalize md:left-[60%]"
        >
          create
        </Btn>
      )}
    </>
  );
};

export default CreateDraft;
