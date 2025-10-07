import { useState, useEffect } from 'react';

export const useFontFamily = (initialFont: string) => {
  const [fontFamily, setFontFamily] = useState(initialFont);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  return { fontFamily, setFontFamily };
};
