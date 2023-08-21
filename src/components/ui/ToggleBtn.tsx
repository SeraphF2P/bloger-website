"use client"

import { FC, useState } from "react"

import { cn } from "../../lib/utils"
import { Button, ButtonProps } from "./button"

interface ToggleBtnProps extends ButtonProps {
  whenToggled?: string
  defaultToggleState?: boolean
}

const ToggleBtn: FC<ToggleBtnProps> = ({
  defaultToggleState = false,
  className,
  whenToggled,
  children,
  ...props
}) => {
  const [isToggled, setisToggled] = useState(defaultToggleState)
  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        setisToggled((prev) => !prev)
      }}
      className={cn(className, isToggled && whenToggled)}
      {...props}
    >
      {typeof children == "function" ? children(isToggled) : children}
    </Button>
  )
}

export default ToggleBtn
