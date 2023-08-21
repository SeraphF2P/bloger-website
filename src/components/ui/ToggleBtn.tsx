"use client";

import Btn, { type BtnProps } from "./Btn";
import { cn } from "@/lib/cva";
import { type FC, type ReactNode, useState, ReactElement } from "react";

interface ToggleBtnProps extends Omit<BtnProps, "children"> {
  whenToggled?: string;
  defaultToggleState?: boolean;
  children: ReactNode | ((_val: any) => ReactNode);
}

const ToggleBtn: FC<ToggleBtnProps> = ({
  defaultToggleState = false,
  className,
  whenToggled,
  children,
  ...props
}) => {
  const [isToggled, setisToggled] = useState(defaultToggleState);
  return (
    <Btn
      onClick={(e) => {
        e.preventDefault();
        setisToggled((prev) => !prev);
      }}
      className={cn(className, isToggled && whenToggled)}
      {...props}
    >
      {typeof children == "function" ? children(isToggled) : children}
    </Btn>
  );
};

export default ToggleBtn;
