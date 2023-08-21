"use client";

import useClickOutside from "../../hooks/useClickOutside";
import { useRef, type ReactNode } from "react";

const Modal = (props: {
  children?: ReactNode;
  className?: string;
  onClickOutside: () => void;
}) => {
  const modal = useRef(null);
  useClickOutside(modal, props.onClickOutside);

  return (
    <div ref={modal} {...props}>
      {props.children}
    </div>
  );
};

export default Modal;
