import { useCallback, useRef } from 'react';

interface UseInfinityScrollProps {
  loadMore: () => void;
  threshold?: number;
  isLoading?: boolean;
}

const useInfinityScroll = ({
  loadMore,
  threshold = 100,
  isLoading = false,
}: UseInfinityScrollProps) => {
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScrollLogic = useCallback(
    (scrollHeight: number, scrollTop: number, clientHeight: number) => {
      if (scrollTimeout.current || isLoading) return;

      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        scrollTimeout.current = setTimeout(() => {
          loadMore();
          scrollTimeout.current = null;
        }, 100);
      }
    },
    [loadMore, threshold, isLoading],
  );

  const handleNativeScroll = useCallback(
    (event: Event) => {
      const element = event.target as HTMLDivElement;
      const { scrollHeight, scrollTop, clientHeight } = element;
      handleScrollLogic(scrollHeight, scrollTop, clientHeight);
    },
    [handleScrollLogic],
  );

  const handleReactScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
      handleScrollLogic(scrollHeight, scrollTop, clientHeight);
    },
    [handleScrollLogic],
  );

  return {
    handleScroll: handleReactScroll,
    handleNativeScroll: handleNativeScroll as EventListener,
  };
};

export default useInfinityScroll;
