import { type ReactNode } from "react";
import { RotatingLines } from "react-loader-spinner";

const Loading = ({
  children,
  as = "component",
}: {
  children?: ReactNode;
  as?: "page" | "component";
}) => {
  return (
    <>
      <div className={` grid  h-full w-full  bg-transparent`}>
        <div className=" m-auto">
          {as == "component" ? (
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              visible={true}
              width="100%"
            />
          ) : null}
          {as == "page" ? (
            <div className=" absolute inset-0 grid overflow-hidden">
              <div className=" relative m-auto h-60 w-40 animate-[spin_7s_linear_infinite] [--reset-duration:5s] xsm:w-52 ">
                <div className=" absolute inset-0  -left-24  right-24 translate-x-20 skew-x-6 skew-y-6 animate-reset  bg-fuchsia-500/80 blur-[60px] [--reset-delay:2.5s] dark:bg-fuchsia-700    " />
                <div className=" absolute inset-0  -right-24  left-24 -translate-x-20 skew-x-6 skew-y-6 animate-reset  bg-amber-400/80  blur-[60px] [--reset-delay:3.25s] dark:bg-amber-500   " />
                <div className=" absolute inset-0  -top-24  bottom-24 translate-y-20 skew-x-6 skew-y-6 animate-reset bg-indigo-500/80  blur-[60px]   [--reset-delay:1.75s] dark:bg-indigo-700  " />
                <div className=" absolute inset-0  -bottom-24  top-24 -translate-y-20 skew-x-6 skew-y-6 animate-reset  bg-sky-400/80 blur-[60px] [--reset-delay:5s] dark:bg-sky-500     " />
              </div>
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </>
  );
};

export default Loading;
