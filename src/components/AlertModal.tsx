import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { type HTMLAttributes } from "react";
import Btn from "./Btn";

interface AlertProps extends HTMLAttributes<HTMLButtonElement> {
  onConfirm: () => void;
  disabled?: boolean;
}
const Alert = ({ onConfirm, disabled, ...props }: AlertProps) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button disabled={disabled} {...props} />
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className=" fixed inset-0 flex items-center justify-center backdrop-blur-sm dark:bg-gray-700/40">
        <AlertDialog.Content className="  mx-4 flex w-full max-w-xs flex-col gap-4 rounded bg-slate-100 px-8 py-4 shadow  dark:bg-slate-800 ">
          <AlertDialog.Title className=" text-xl">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description  className=" text-sm">
            This action cannot be undone. This will permanently delete your
            post.
          </AlertDialog.Description>
          <div className=" flex justify-between  px-2">
            <AlertDialog.Cancel asChild>
              <Btn variant={"ghost"} className="  rounded px-4 py-2">
                Cancel
              </Btn>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Btn
                onClick={() => onConfirm()}
                className=" red rounded px-4 py-2"
              >
                confirm
              </Btn>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default Alert;
