import { useEffect, useState } from 'react';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { getThemeFromStorage } from '@/helpers/utils/storage';

export const useThemeColor = () => {
  const [themeColor, setThemeColor] = useState<string>('');

  useEffect(() => {
    const updateThemeColor = () => {
      const currentTheme = getThemeFromStorage();
      const chartColor = themeCatalog[currentTheme]?.colors.chartColor ?? '#111111';
      setThemeColor(chartColor);
    };

    updateThemeColor();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        updateThemeColor();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return themeColor;
};
