/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<cbType extends (...args: any) => any>(
  callBack: cbType,
  delay = 1000
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<cbType>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callBack(...args);
    }, delay);
  };
}

export function throttle<cbType extends (...args: unknown[]) => void>(
  callBack: cbType,
  delay = 1000
) {
  let shouldWait = false;
  let waitingArgs: Parameters<cbType> | null;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      callBack(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };
  return (...args: Parameters<cbType>) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    callBack(...args);
    shouldWait = true;

    setTimeout(timeoutFunc, delay);
  };
}
