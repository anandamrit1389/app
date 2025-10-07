import { useState, useEffect } from 'react';

type DeviceDetect = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const useDeviceDetect = (): DeviceDetect => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const updateDeviceType = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width <= 1024);
    setIsDesktop(width > 1024);
  };

  useEffect(() => {
    updateDeviceType();

    window.addEventListener('resize', updateDeviceType);

    return () => {
      window.removeEventListener('resize', updateDeviceType);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};

export default useDeviceDetect;
