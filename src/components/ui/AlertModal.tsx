import * as Dialog from "@radix-ui/react-dialog";
import Btn, {type BtnProps } from "./Btn";

interface AlertModalPropsType extends BtnProps {
  onConfirm: () => void;
  disabled?: boolean;
}
const AlertModal = ({ onConfirm, disabled, ...props }: AlertModalPropsType) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Btn disabled={disabled} {...props} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 flex items-center justify-center backdrop-blur-sm dark:bg-gray-700/40">
          <Dialog.Content className="  mx-4 flex w-full max-w-xs flex-col gap-4 rounded bg-slate-100 px-8 py-4 shadow  dark:bg-slate-800 ">
            <Dialog.Title className=" text-xl">
              Are you absolutely sure?
            </Dialog.Title>
            <Dialog.Description className=" text-sm">
              This action cannot be undone. This will permanently delete your
              post.
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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AlertModal;
