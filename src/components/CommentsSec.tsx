import { Btn, type BtnProps } from "@/ui";
import * as Dialog from "@radix-ui/react-dialog";

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
        <Dialog.Overlay className=" data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout opacity-0 fixed inset-0  flex justify-center items-end backdrop-blur-sm dark:bg-gray-700/40">
          <Dialog.Content asChild>
            <div className="data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout  translate-y-full relative  bg-black mn:max-w-xs w-full shadow mx-4 h-full">
              {/* <div className=" relative  h-96  w-80    bg-red-400 "></div> */}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AlertModal;
