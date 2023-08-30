"use client";

import { cn } from "@/lib/cva";
import { throttle } from "@/lib/performance";
import { useMove, useResizeObserver, useViewportSize } from "@mantine/hooks";
import {
  motion as m,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { FC, MutableRefObject, ReactNode, RefObject } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";

//TODO fix the referance error for the refs in thumb component
//TODO add xAxis option

type scrollBarProps = {
  children: ReactNode;
  container?: RefObject<HTMLElement>;
  step?: number;
  throttleDelay?: number;
};
const Context = createContext<{
  trackRef: MutableRefObject<HTMLDivElement | null>;
  thumbRef: MutableRefObject<HTMLDivElement | null>;
  scrollContainer: RefObject<HTMLElement>;
  container?: RefObject<HTMLElement>;
  visible: boolean;
  height: number | string;
  maxY: number;
  step: number;
  throttleDelay: number;
}>({
  visible: false,
  height: 0,
  maxY: 0,
  scrollContainer: { current: null },
  trackRef: { current: null },
  thumbRef: { current: null },
  step: 200,
  throttleDelay: 100,
});
const useContextHook = () => useContext(Context);

export const ScrollBar = ({
  children,
  container,
  step = 200,
  throttleDelay = 100,
}: scrollBarProps) => {
  const [thumbRef, thumb] = useResizeObserver<HTMLDivElement>();
  const [trackRef, track] = useResizeObserver<HTMLDivElement>();
  const { height: ViewportHeight } = useViewportSize();
  const scrollContainer = useMemo(() => {
    return container ? container : { current: document.body };
  }, [container]);

  const maxY = track.height - thumb.height;

  const config = useMemo(() => {
    return {
      scrollableHeight: 0,
      minHeight: ViewportHeight,
    };
  }, [ViewportHeight]);

  useEffect(() => {
    if (scrollContainer.current instanceof HTMLElement) {
      config.scrollableHeight = scrollContainer.current.scrollHeight;
    } else {
      config.scrollableHeight = document.body.scrollHeight;
    }
  }, [config, container, scrollContainer]);
  const visible = config.scrollableHeight > config.minHeight;
  return (
    <Context.Provider
      value={{
        trackRef,
        thumbRef,
        container,
        scrollContainer,
        step,
        throttleDelay,
        maxY,
        visible,
        height: `${track.height ** 2 / config.scrollableHeight}px`,
      }}
    >
      {children}
    </Context.Provider>
  );
};
type ThumbPropsType = {
  className?: string;
  children?: ReactNode;
};

export const Thumb: FC<ThumbPropsType> = ({ className, children }) => {
  const {
    thumbRef,
    maxY,
    height,
    scrollContainer,
    step,
    throttleDelay,
    container,
  } = useContextHook();
  const scrollAbleContainer = container ? scrollContainer : { current: window };
  const scrollByStep = throttle((coord) => {
    const { y } = coord as { x: number; y: number };
    const dir = y - 0.5;
    scrollAbleContainer.current?.scrollBy({
      top: step * dir,
      behavior: "smooth",
    });
  }, throttleDelay);

  const { ref, active } = useMove(scrollByStep);

  const { scrollYProgress } = useScroll({ container, layoutEffect: false });

  const dragY = useTransform(scrollYProgress, [0, 1], [0, maxY]);
  thumbRef.current = ref.current;

  return (
    <m.div
      ref={ref}
      data-active={active}
      style={{
        y: useMotionTemplate`${dragY}px`,
        height,
      }}
      className={cn(" h-10 w-2 rounded-full  bg-red-500", className)}
    >
      {children}
    </m.div>
  );
};

type TrackPropsType = {
  children: ReactNode;
  className?: string;
};
export const Track: FC<TrackPropsType> = ({ children, className }) => {
  const { visible, trackRef } = useContextHook();
  return (
    <div
      ref={trackRef}
      data-visible={visible}
      className={cn(
        " data-[visible=false]:hidden  rounded-full flex justify-center w-4  bg-blue-400 fixed ",
        className
      )}
    >
      {children}
    </div>
  );
};

ScrollBar.track = Track;
ScrollBar.thumb = Thumb;
export default ScrollBar;
