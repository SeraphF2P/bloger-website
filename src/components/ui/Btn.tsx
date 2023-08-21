import { cn, variants, type variantsType } from "@/lib/cva";
import type { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from "react";

type ReactRenderedChildrenProps = (props: unknown) => JSX.Element | ReactNode;
export interface BtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement | HTMLDivElement>,
    variantsType {}

const Btn: FC<BtnProps> = ({
  onClick,
  className,
  variant,
  shape,
  children,
  type = "button",
  ...props
}) => {
  return (
    <>
      <button
        onClick={(
          e: MouseEvent<
            HTMLButtonElement | HTMLDivElement,
            globalThis.MouseEvent
          >
        ) => {
          e.stopPropagation();
          if (typeof onClick === "function") {
            onClick(e);
          }
        }}
        className={cn(variants({ variant, shape }), className)}
        type={type}
        {...props}
      >
        {children}
      </button>
    </>
  );
};
export default Btn;
