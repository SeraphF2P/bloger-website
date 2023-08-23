import Btn, { type BtnProps } from "./Btn";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface AlertModalPropsType extends BtnProps {
  onConfirm: () => void;
  disabled?: boolean;
}
const MotionContent = motion(Dialog.Content);
const MotionOverlay = motion(Dialog.Overlay);
const AlertModal = ({ onConfirm, ...props }: AlertModalPropsType) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Btn onClick={() => setOpen(!open)} {...props} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <MotionOverlay
              key={"asdasdasda"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className=" fixed inset-0 flex items-center justify-center backdrop-blur-sm dark:bg-gray-700/40"
            >
              <MotionContent
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 3 }}
                className="  mx-4 flex w-full max-w-xs flex-col gap-4 rounded bg-slate-100 px-8 py-4 shadow  dark:bg-slate-800 "
              >
                <Dialog.Title className=" text-xl">
                  Are you absolutely sure?
                </Dialog.Title>
                <Dialog.Description className=" text-sm">
                  This action cannot be undone. This will permanently delete
                  your post.
                </Dialog.Description>
                <div className=" flex justify-between  px-2">
                  <Dialog.Close asChild>
                    <Btn variant="ghost" className="  rounded px-4 py-2">
                      Cancel
                    </Btn>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Btn
                      onClick={() => onConfirm()}
                      variant="fill"
                      className=" [--variant:rgb(153_27_27)] text-theme rounded px-4 py-2"
                    >
                      confirm
                    </Btn>
                  </Dialog.Close>
                </div>
              </MotionContent>
            </MotionOverlay>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AlertModal;
