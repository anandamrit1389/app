import { useState, useEffect } from 'react';

export const useTheme = (initialTheme: string) => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: theme }));
  }, [theme]);

  const toggleTheme = (newTheme: string) => {
    document.documentElement.classList.replace(theme, newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
};
