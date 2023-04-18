"use client";
import { btnVariants, cn, type BtnVariants } from "@/lib/cva";
import {
  type ForwardedRef,
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  LegacyRef,
} from "react";
interface BtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BtnVariants {
  onClick?: (val: any) => void;
  onToggle?: string;
  isToggled?: boolean;
  status?: string;
  hasStatus?: boolean;
  toggleDependencies?: unknown;
  children?: any;
}
type renderedPropsType = { isToggled: boolean; hasStatus: boolean };
const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  (
    {
      onClick,
      onToggle,
      isToggled = false,
      status,
      hasStatus,
      children,
      className,
      variant,
      shape,
      ...props
    },
    ref
  ) => {
    const [toggled, setToggled] = useState(isToggled);

    return (
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
        {typeof children == "function"
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            children({ isToggled, hasStatus } as renderedPropsType)
          : children}
      </button>
    );
  }
);
Btn.displayName = "Btn";
export default Btn;
