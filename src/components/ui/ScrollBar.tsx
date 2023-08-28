// "use client";

// import { cn } from "@/lib/cva";
// import { throttle } from "@/lib/performance";
// import { useMove, useResizeObserver, useViewportSize } from "@mantine/hooks";
// import {
//   motion as m,
//   useMotionTemplate,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import type { FC, MutableRefObject, ReactNode, RefObject } from "react";
// import { createContext, useContext } from "react";
// import { createPortal } from "react-dom";

// //TODO fix the error: window not found
// //TODO add xAxis option

// type scrollBarProps = {
//   children: ReactNode;
//   scrollContainer?: RefObject<HTMLElement>;
//   step?: number;
//   throttleDelay?: number;
// };
// const Context = createContext<{
//   trackRef: MutableRefObject<HTMLDivElement | null>;
//   thumbRef: MutableRefObject<HTMLDivElement | null>;
//   scrollContainer?: RefObject<HTMLElement>;
//   active: boolean;
//   visible: boolean;
//   height: number | string;
//   maxY: number;
// }>({
//   active: false,
//   visible: false,
//   height: 0,
//   maxY: 0,
//   scrollContainer: { current: null },
//   trackRef: { current: null },
//   thumbRef: { current: null },
// });
// const useContextHook = () => useContext(Context);

// const ScrollBar = ({
//   children,
//   scrollContainer,
//   step = 200,
//   throttleDelay = 100,
// }: scrollBarProps) => {
//   const [thumbRef, thumb] = useResizeObserver<HTMLDivElement>();
//   const [trackRef, track] = useResizeObserver<HTMLDivElement>();
//   const { height: ViewportHeight } = useViewportSize();

//   const maxY = track.height - thumb.height;
//   const container = scrollContainer ?? { current: document.body };
//   const scrollByStep = throttle((coord) => {
//     const { y } = coord as { x: number; y: number };
//     const dir = y >= 0.5 ? 1 : -1;
//     container.current?.scrollBy({
//       top: step * dir,
//       behavior: "smooth",
//     });
//   }, throttleDelay);

//   const { ref, active } = useMove(scrollByStep);
//   thumbRef.current = ref.current;
//   const config =
//     container.current instanceof HTMLElement
//       ? {
//           scrollableHeight: container.current.scrollHeight,
//           minHeight: ViewportHeight,
//         }
//       : {
//           scrollableHeight: document.body.scrollHeight,
//           minHeight: ViewportHeight,
//         };
//   const visible = config.scrollableHeight > config.minHeight;
//   return (
//     <Context.Provider
//       value={{
//         trackRef,
//         thumbRef: ref,
//         scrollContainer,
//         maxY,
//         active,
//         visible,
//         height: `${track.height ** 2 / config.scrollableHeight}px`,
//       }}
//     >
//       <Portal>{children}</Portal>
//     </Context.Provider>
//   );
// };
// type ThumbPropsType = {
//   className?: string;
// };

// const Thumb: FC<ThumbPropsType> = ({ className }) => {
//   const { thumbRef, active, maxY, height, scrollContainer } = useContextHook();

//   const { scrollYProgress } = useScroll({ container: scrollContainer });
//   console.log("scrollYProgress", scrollYProgress);
//   const dragY = useTransform(scrollYProgress, [0, 1], [0, maxY]);
//   return (
//     <m.div
//       ref={thumbRef}
//       data-active={active}
//       style={{
//         y: useMotionTemplate`${dragY}px`,
//         height,
//       }}
//       className={cn(" h-10 w-2 rounded-full  bg-red-500", className)}
//     />
//   );
// };

// type TrackPropsType = {
//   children: ReactNode;
//   className?: string;
// };
// const Track: FC<TrackPropsType> = ({ children, className }) => {
//   const { active, visible, trackRef } = useContextHook();
//   return (
//     <div
//       ref={trackRef}
//       data-active={active}
//       data-visible={visible}
//       className={cn(
//         " data-[visible=false]:hidden  rounded-full flex justify-center w-4  bg-blue-400 fixed ",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// };
// const Portal = ({ children }: { children: ReactNode }) => {
//   const { scrollContainer } = useContextHook();
//   return createPortal(children, scrollContainer?.current ?? document.body);
// };
// ScrollBar.track = Track;
// ScrollBar.thumb = Thumb;
// export default ScrollBar;
