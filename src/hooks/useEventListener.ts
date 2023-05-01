"use client"
import { useEffect, useRef } from "react";

type EventListener = (event: Event) => void;

export default function useEventListener(
  eventType: keyof WindowEventMap,
  callback: EventListener | ((event: Event) => void),
  element: Document | HTMLElement | (Window & typeof globalThis) = window
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) {
      return;
    }
    const handler: EventListener = (event: Event) => {
      callbackRef.current(event);
    };

    element.addEventListener(eventType, handler);

    return () => {
      element.removeEventListener(eventType, handler);
    };
  }, [eventType, element]);
}
