import { useState, useEffect } from 'react';

const useTablet = (breakpoint1 = 768, breakpoint2 = 1000) => {
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= breakpoint1 && window.innerWidth < breakpoint2,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= breakpoint1 && window.innerWidth < breakpoint2);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint1, breakpoint2]);

  return isTablet;
};

export default useTablet;
