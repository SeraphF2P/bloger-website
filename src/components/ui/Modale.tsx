import { Btn, type BtnProps } from ".";
import { cn } from "@/lib/cva";
import type { DialogContentProps } from "@radix-ui/react-dialog";
import * as Dialog from "@radix-ui/react-dialog";

const Modale = (props: JSX.IntrinsicAttributes & Dialog.DialogProps) => (
  <Dialog.Root {...props}>{props.children}</Dialog.Root>
);
const Button = ({ children, ...props }: BtnProps) => (
  <Dialog.Trigger asChild>
    <Btn {...props}>{children}</Btn>
  </Dialog.Trigger>
);
const Close = ({ children, ...props }: BtnProps) => (
  <Dialog.Close asChild>
    <Btn {...props}>{children}</Btn>
  </Dialog.Close>
);
const ModaleContent = ({
  children,
  className = "",
  ...props
}: DialogContentProps & React.RefAttributes<HTMLDivElement>) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className=" z-50 data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout opacity-0 fixed inset-0 flex items-center justify-center backdrop-blur-sm dark:bg-gray-700/40">
        <Dialog.Content
          {...props}
          className={cn(
            " data-[state=open]:animate-fadein data-[state=closed]:animate-fadeout translate-y-16 opacity-0 ",
            className
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
};

Modale.Close = Close;
Modale.Title = Dialog.Title;
Modale.Description = Dialog.Description;
Modale.Content = ModaleContent;
Modale.Btn = Button;
export default Modale;
