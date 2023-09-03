"use client";

import { cn } from "@/lib/cva";
import { throttle } from "@/lib/performance";
import { useMove, useResizeObserver } from "@mantine/hooks";
import { motion as m, useMotionTemplate, useScroll } from "framer-motion";
import type { FC, MutableRefObject, ReactNode, RefObject } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

//TODO fix the referance error for the refs in thumb component
//TODO add xAxis option

type scrollBarProps = {
  children: ReactNode;
  container?: RefObject<HTMLElement>;
  throttleDelay?: number;
  orientation?: "x" | "y";
  axis?: "x" | "y";
};
const Context = createContext<{
  trackRef: MutableRefObject<HTMLDivElement | null>;
  thumbRef: MutableRefObject<HTMLDivElement | null>;
  scrollContainer: RefObject<HTMLElement>;
  container?: RefObject<HTMLElement>;
  config: {
    trackLength: number;
    thumbLength: number;
    maxTrackScroll: number;
    scrollableLength: number;
    isVisiable: boolean;
  };
  throttleDelay: number;
  orientation: "x" | "y";
  axis: "x" | "y";
}>({
  scrollContainer: { current: null },
  trackRef: { current: null },
  thumbRef: { current: null },
  config: {
    scrollableLength: 0,
    trackLength: 0,
    thumbLength: 0,
    maxTrackScroll: 0,
    isVisiable: false,
  },
  throttleDelay: 0,
  orientation: "y",
  axis: "y",
});
const useContextHook = () => useContext(Context);

export const ScrollBar = ({
  children,
  container,
  throttleDelay = 100,
  orientation = "y",
  axis = "y",
}: scrollBarProps) => {
  const [thumbRef, thumb] = useResizeObserver<HTMLDivElement>();
  const [trackRef, track] = useResizeObserver<HTMLDivElement>();
  const scrollContainer = useMemo(() => {
    return container ? container : { current: document.body };
  }, [container]);

  const config = useMemo(() => {
    let scrollableLength = 0;
    let scrollOffset = 0;
    if (scrollContainer.current instanceof HTMLElement) {
      if (axis == "y") {
        scrollableLength = scrollContainer.current.scrollHeight;
        scrollOffset = scrollContainer.current.offsetHeight;
      } else if (axis == "x") {
        scrollableLength = scrollContainer.current.scrollWidth;
        scrollOffset = scrollContainer.current.offsetWidth;
      }
    } else {
      if (axis == "y") {
        scrollableLength = document.body.scrollHeight;
        scrollOffset = document.body.offsetHeight;
      } else if (axis == "x") {
        scrollableLength = document.body.scrollWidth;
        scrollOffset = document.body.offsetWidth;
      }
    }
    const thumbLength = track.height ** 2 / scrollableLength;
    return {
      scrollableLength,
      maxTrackScroll: track.height - thumb.height,
      trackLength: track.height,
      thumbLength,
      isVisiable: scrollOffset != scrollableLength,
    };
  }, [axis, scrollContainer, thumb.height, track.height]);

  return (
    <Context.Provider
      value={{
        trackRef,
        thumbRef,
        container,
        scrollContainer,
        axis,
        orientation,
        config,
        throttleDelay,
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

    scrollContainer,
    config,
    throttleDelay,
    container,
    orientation,
    axis,
  } = useContextHook();
  const scrollAbleContainer = container ? scrollContainer : { current: window };

  const { scrollYProgress, scrollXProgress } = useScroll({
    container,
    layoutEffect: false,
  });
  function scrollCousure() {
    const modifier = config.thumbLength / config.trackLength;
    const Action = {
      y: (y: number) => {
        const dir = orientation == "y" ? y : -y;
        scrollAbleContainer.current?.scrollBy({
          top: config.scrollableLength * modifier * dir,
          behavior: "smooth",
        });
      },
      x: (x: number) => {
        const dir = orientation == "y" ? x : -x;
        scrollAbleContainer.current?.scrollBy({
          left: config.scrollableLength * modifier * dir,
          behavior: "smooth",
        });
      },
    };
    return (coord: { x: number; y: number }) => {
      const dir = coord[orientation] * 2 - 1;
      Action[axis](dir);
    };
  }
  const scroll = scrollCousure() as (...arg: unknown[]) => void;

  const { ref, active } = useMove(throttle(scroll, throttleDelay));

  thumbRef.current = ref.current;

  return (
    <m.div
      ref={ref}
      data-active={active}
      style={{
        y: useMotionTemplate`calc(${
          axis == "y" ? scrollYProgress : scrollXProgress
        } * ${config.maxTrackScroll}px)`,
        height: `${config.thumbLength}px`,
      }}
      className={cn(" min-w-[1px] rounded-full  bg-red-500", className)}
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
  const { trackRef, scrollContainer, axis } = useContextHook();
  const [isVisiable, setIsVisiable] = useState(true);
  useEffect(() => {
    let scrollableLength = 0;
    let scrollOffset = 0;
    if (scrollContainer.current instanceof HTMLElement) {
      if (axis == "y") {
        scrollableLength = scrollContainer.current.scrollHeight;
        scrollOffset = scrollContainer.current.offsetHeight;
      } else if (axis == "x") {
        scrollableLength = scrollContainer.current.scrollWidth;
        scrollOffset = scrollContainer.current.offsetWidth;
      }
    } else {
      if (axis == "y") {
        scrollableLength = document.body.scrollHeight;
        scrollOffset = document.body.offsetHeight;
      } else if (axis == "x") {
        scrollableLength = document.body.scrollWidth;
        scrollOffset = document.body.offsetWidth;
      }
    }
    setIsVisiable(scrollOffset != scrollableLength);
  }, [axis, scrollContainer]);

  return (
    <div
      ref={trackRef}
      data-visiable={isVisiable}
      className={cn(
        " data-[visiable=false]:hidden  rounded-full flex justify-center w-4  bg-blue-400 fixed ",
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
