import { useEffect } from "react";

export default function useScrollLock(locked: boolean) {
  useEffect(() => {
    const element = document.body;
    if (locked) {
      element.style.overflow = "hidden";
    } else {
      element.style.overflow = "visible";
    }
    return () => {
      element.style.overflow = "visible";
    };
  }, [locked]);
}
