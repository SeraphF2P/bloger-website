"use client";
import { btnVariants, cn, type BtnVariants } from "@/lib/cva";
import type {
  ButtonHTMLAttributes,
  Dispatch,
  ExoticComponent,
  MouseEvent,
  ReactNode,
  SetStateAction,
} from "react";
import { useState } from "react";
interface BtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement | HTMLDivElement>,
    BtnVariants {
  onClick?: (_val: unknown) => void;
  onToggle?: string;
  toggled?: boolean;
  status?: string;
  hasStatus?: boolean;
  as?:
    | "button"
    | "div"
    | "main"
    | ExoticComponent<{
        children?: ReactNode | undefined;
      }>;
}
type renderedPropsType = {
  isToggled: boolean;
  hasStatus: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
};
type ReactRenderedChildrenProps = (
  props: renderedPropsType
) => JSX.Element | ReactNode;
type ThisComponentProps =
  | BtnProps
  | (Omit<BtnProps, "children"> & {
      children: ReactRenderedChildrenProps;
    });
const Btn = ({
  onClick,
  onToggle,
  toggled = false,
  status,
  hasStatus = false,
  className,
  variant,
  shape,
  children,
  as = "button",
  ...props
}: ThisComponentProps) => {
  const [isToggled, setToggled] = useState(toggled);
  const toggle = () => {
    setToggled((prev: boolean) => !prev);
  };
  const renderedProps: renderedPropsType = {
    isToggled,
    hasStatus,
    setToggled,
    toggle,
  };
  const Component = as;

  return (
    <>
      <Component
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          if (typeof onClick == "function") {
            onClick({ isToggled, hasStatus });
            toggle();
          }
        }}
        className={
          as === "button"
            ? cn(
                btnVariants({ variant, shape, className }),
                hasStatus && status,
                isToggled && onToggle
              )
            : className
        }
        {...props}
      >
        {typeof children === "function" ? children(renderedProps) : children}
      </Component>
    </>
  );
};

Btn.displayName = "Btn";
export default Btn;
