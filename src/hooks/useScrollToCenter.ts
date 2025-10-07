import { MutableRefObject, useEffect, useRef } from 'react';

const useScrollToCenter = (isActive: boolean, isSideBarActive: boolean, preview?: boolean) => {
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    if (isActive && ref.current && !preview) {
      ref.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }
  }, [isActive, isSideBarActive, preview]);

  return ref;
};

export default useScrollToCenter;
