"use client";

import Btn, { type BtnProps } from "./Btn";
import { cn } from "@/lib/cva";
import { useState, type FC, type ReactNode } from "react";

interface ToggleBtnProps extends Omit<BtnProps, "children"> {
  whenToggled?: string;
  defaultToggleState?: boolean;
  children: ReactNode | (({ isToggled }: { isToggled: boolean }) => ReactNode);
}

const ToggleBtn: FC<ToggleBtnProps> = ({
  defaultToggleState = false,
  className,
  whenToggled,
  children,
  onClick,
  ...props
}) => {
  const [isToggled, setisToggled] = useState(defaultToggleState);
  return (
    <Btn
      onClick={(e) => {
        e.preventDefault();
        setisToggled((prev) => !prev);
        if (typeof onClick === "function") {
          onClick(e);
        }
      }}
      className={cn(className, isToggled && whenToggled)}
      {...props}
    >
      {typeof children == "function" ? children({ isToggled }) : children}
    </Btn>
  );
};

export default ToggleBtn;
