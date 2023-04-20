"use client";
import { btnVariants, cn, type BtnVariants } from "@/lib/cva";
import type {
  ButtonHTMLAttributes,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { forwardRef, useState } from "react";
interface BtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BtnVariants {
  onClick?: (_val: unknown) => void;
  onToggle?: string;
  isToggled?: boolean;
  status?: string;
  hasStatus?: boolean;
  as?: "button" | "div";
}
type renderedPropsType = {
  isToggled: boolean;
  hasStatus: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>
};
const Btn = forwardRef<
  HTMLButtonElement,
  | BtnProps
  | (Omit<BtnProps, "children"> & {
      children: (props: renderedPropsType) => JSX.Element | ReactNode;
    })
>(
  (
    {
      onClick,
      onToggle,
      isToggled = false,
      status,
      hasStatus = false,
      className,
      variant,
      shape,
      children,
      ...props
    },
    ref
  ) => {
    const [toggled, setToggled] = useState(isToggled);
    const renderedProps: renderedPropsType = {
      isToggled,
      hasStatus,
      setToggled,
    };
    return (
      <>
        <button
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onClick == "function") {
              onClick({ isToggled, hasStatus });
              setToggled((prev: boolean) => !prev);
            }
          }}
          className={cn(
            btnVariants({ variant, shape, className }),
            hasStatus && status,
            toggled && onToggle
          )}
          {...props}
        >
          {typeof children === "function" ? children(renderedProps) : children}
        </button>
      </>
    );
  }
);
Btn.displayName = "Btn";
export default Btn;
