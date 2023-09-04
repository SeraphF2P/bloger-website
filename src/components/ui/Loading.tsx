import { cn } from "@/lib/cva";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { RotatingLines } from "react-loader-spinner";

type Div = HTMLAttributes<HTMLDivElement>;
const Mesh = (props: Div) => {
	return (
		<div
			className={cn(" grid  h-full w-full  bg-transparent", props.className)}
		>
			<div className=" m-auto">
				<div className=" absolute inset-0 grid overflow-hidden">
					<div className=" relative m-auto h-60 w-40 animate-[spin_7s_linear_infinite] [--reset-duration:5s] xsm:w-52 ">
						<div className=" absolute inset-0  -left-24  right-24 translate-x-20 skew-x-6 skew-y-6 animate-reset  bg-fuchsia-500/80 blur-[60px] [--reset-delay:2.5s] dark:bg-fuchsia-700    " />
						<div className=" absolute inset-0  -right-24  left-24 -translate-x-20 skew-x-6 skew-y-6 animate-reset  bg-amber-400/80  blur-[60px] [--reset-delay:3.25s] dark:bg-amber-500   " />
						<div className=" absolute inset-0  -top-24  bottom-24 translate-y-20 skew-x-6 skew-y-6 animate-reset bg-indigo-500/80  blur-[60px]   [--reset-delay:1.75s] dark:bg-indigo-700  " />
						<div className=" absolute inset-0  -bottom-24  top-24 -translate-y-20 skew-x-6 skew-y-6 animate-reset  bg-sky-400/80 blur-[60px] [--reset-delay:5s] dark:bg-sky-500     " />
					</div>
				</div>
			</div>
		</div>
	);
};
const Spinner = (props: Div) => {
	return (
		<div
			className={cn(" grid  h-full w-full  bg-transparent", props.className)}
		>
			<div className=" m-auto">
				<RotatingLines
					strokeColor="grey"
					strokeWidth="5"
					animationDuration="0.75"
					visible={true}
					width="100%"
				/>
			</div>
		</div>
	);
};

const SkeletonPage = ({ count, className }: Div & { count: number }) => {
	const skeletons = Array.from({ length: count });
	return (
		<div className={className}>
			{skeletons.map((_, index) => (
				<SkelatonPost index={index} key={index} />
			))}
		</div>
	);
};

function SkelatonPost({ className, index = 0 }: Div & { index?: number }) {
	const widthRandomizer = (100 - Math.floor(Math.random() * 30)) / 100;
	const numOfline = Math.random() >= 0.5 ? 3 : 2;
	const delay = index * 0.2;
	return (
		<div
			style={{
				animation: `fadein 1s linear infinite ${delay}s,
        fadeout 1s linear infinite ${delay + 1}s`,
			}}
			className={cn("-translate-y-16  space-y-2 w-full", className)}
		>
			<div className="flex  animate-pulse">
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

const Loading = ({ children }: PropsWithChildren) => children;

Loading.Spinner = Spinner;
Loading.Mesh = Mesh;
Loading.SkelatonPost = SkelatonPost;
Loading.SkeletonPage = SkeletonPage;

export default Loading;
