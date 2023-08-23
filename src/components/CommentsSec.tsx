import { Btn, type BtnProps } from "@/ui";
import * as Dialog from "@radix-ui/react-dialog";
import { motion as m } from "framer-motion";

interface CommentsSecPropsType extends BtnProps {
  asd?: string;
}

const AlertModal = ({ ...props }: CommentsSecPropsType) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Btn {...props} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay  className=" fixed inset-0  backdrop-blur-sm dark:bg-gray-700/40">
          <Dialog.Content asChild>
            <m.div
              animate={{ y: "-100%" }}
              className=" mx-auto relative top-full bg-sky-500 w-80 h-96"
            >
              {/* <div className=" relative  h-96  w-80    bg-red-400 "></div> */}
            </m.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AlertModal;
