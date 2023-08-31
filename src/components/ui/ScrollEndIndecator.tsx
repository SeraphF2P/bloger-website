import { useInView } from "framer-motion";
import { type HTMLAttributes, useEffect, useRef, type FC } from "react";

interface ScrollEndIndecatorProps extends HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean;
  onError?: () => void;
}

const ScrollEndIndecator: FC<ScrollEndIndecatorProps> = ({
  fetchNextPage,
  hasNextPage,
  onError,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage().catch(onError);
    }
  }, [hasNextPage, isInView, fetchNextPage, onError]);

  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
};

export default ScrollEndIndecator;
