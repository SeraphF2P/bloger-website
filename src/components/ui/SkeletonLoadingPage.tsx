import type { FC } from "react";

interface SkeletonLoadingPageProps {
  count: number;
  className?: string;
}

const SkeletonLoadingPage: FC<SkeletonLoadingPageProps> = ({
  count,
  className,
}) => {
  const skeletons = Array.from({ length: count });
  return (
    <div className={className}>
      {skeletons.map((_, index) => (
        <SkelatonPost index={index} key={index} />
      ))}
    </div>
  );
};
function SkelatonPost({ index }: { index: number }) {
  const widthRandomizer = (100 - Math.floor(Math.random() * 30)) / 100;
  const numOfline = Math.random() >= 0.5 ? 3 : 2;
  return (
    <div
      style={{
        animation: `fadein 1s linear infinite ${
          (index + 1) * 0.1
        }s,fadeout 1s linear infinite ${(index + 1) * 1.1}s`,
      }}
      className="   translate-y-16  space-y-2 w-full max-w-xs  "
    >
      <div className="flex animate-pulse">
        <div className=" bg-gray-300/80 dark:bg-gray-700/70  basis-20 h-20 w-20  rounded-full" />
        <div className="flex-1 flex pl-4   flex-col gap-2 items-start justify-center">
          <div
            style={{
              width: `${widthRandomizer * 80}px`,
            }}
            className=" bg-gray-400/70 dark:bg-gray-500/70    rounded-full  h-6"
          />
          <div
            style={{
              width: `${widthRandomizer * 120}px`,
            }}
            className=" bg-gray-400/70 dark:bg-gray-500/70    rounded-full  h-6"
          />
        </div>
      </div>
      <div className=" animate-pulse bg-gray-400/70 dark:bg-gray-500/70 space-y-2 p-4 rounded-md ">
        {Array.from({
          length: numOfline,
        }).map((_, index) => {
          const widthRandomizer = 100 - Math.floor(Math.random() * 40);
          return (
            <div
              key={index}
              style={{
                width: `${widthRandomizer}%`,
              }}
              className=" bg-gray-300/80 dark:bg-gray-700/70 w-full rounded-full  h-6"
            />
          );
        })}
      </div>
    </div>
  );
}
export default SkeletonLoadingPage;
