import { useState, useEffect } from 'react';

const useMobile = (defaultBreakpoint = 768) => {
  const getBreakpoint = () => {
    const isLandscape = window.screen.orientation?.type?.startsWith('landscape');
    return isLandscape ? 1024 : defaultBreakpoint;
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < getBreakpoint());

  useEffect(() => {
    const handleResize = () => {
      const breakpoint = getBreakpoint();
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [defaultBreakpoint]);

  return isMobile;
};

export default useMobile;
