import { type BtnProps } from "./Btn";
import Modale from "./Modale";
import { useState } from "react";

interface AlertModalPropsType extends BtnProps {
  onConfirm: () => void;
  disabled?: boolean;
}
const AlertModal = ({ onConfirm, ...props }: AlertModalPropsType) => {
  const [open, setOpen] = useState(false);
  return (
    <Modale open={open} onOpenChange={setOpen}>
      <Modale.Btn onClick={() => setOpen(!open)} {...props} />
      <Modale.Content className=" mx-4 flex w-full max-w-xs flex-col gap-4 rounded bg-slate-100 px-8 py-4 shadow  dark:bg-slate-800 ">
        <Modale.Title className=" text-xl">
          Are you absolutely sure?
        </Modale.Title>
        <Modale.Description className=" text-sm">
          This action cannot be undone. This will permanently delete your post.
        </Modale.Description>
        <div className=" flex justify-between  px-2">
          <Modale.Close variant="ghost" className="  rounded px-4 py-2">
            Cancel
          </Modale.Close>

          <Modale.Close
            onClick={() => onConfirm()}
            variant="fill"
            className=" [--variant:--alert] text-theme rounded px-4 py-2"
          >
            confirm
          </Modale.Close>
        </div>
      </Modale.Content>
    </Modale>
  );
};

export default AlertModal;
