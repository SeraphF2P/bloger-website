"use client";
import React, { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RotatingLines } from "react-loader-spinner";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
type Props = {
  children: ReactNode;
};
export default function SuspenseErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div
          className={`text-red  flex w-full items-center justify-center gap-4 bg-transparent p-4`}
        >
          <ExclamationCircleIcon width={24} height={24} />
          <span> Could not fetch the data</span>
        </div>
      }
    >
      {typeof window !== "undefined" && (
        <Suspense
          fallback={
            <div className={` grid h-40 w-screen  bg-transparent`}>
              <div className=" m-auto">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={true}
                />
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      )}
    </ErrorBoundary>
  );
}
