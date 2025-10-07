import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useOnScreen = (threshold = 0.3) => {
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const options = { threshold };

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return { ref, isVisible };
};

export default useOnScreen;
