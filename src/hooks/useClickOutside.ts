"use client";
import { type RefObject, useCallback } from "react";
import useEventListener from "./useEventListener";

type Callback = (event: Event) => void;

export default function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  cb: Callback
) {
  const handleClickOutside = useCallback(
    (event: Event) => {
      if (ref.current == null || ref.current.contains(event.target as Node)) {
        return;
      }
      cb(event);
    },
    [ref, cb]
  );

  useEventListener("click", handleClickOutside, document);
}
