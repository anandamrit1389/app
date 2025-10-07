import { useMemo, useState, useEffect } from 'react';
import { imageStylesList } from '@/components/DrawersAndSheets/ImageStyleDrawer/categories';
import { ImageStyleSlug } from '@/interfaces/images-styles.interface';

export const useAIImageStyles = (presentationImageStyle?: string) => {
  const aiCompatibleStyles = useMemo(
    () => imageStylesList.filter((style) => style.slug !== ImageStyleSlug.WebStockPhotosOnly),
    [],
  );

  const getDefaultAIStyle = (currentStyle?: string): string => {
    if (!currentStyle) return aiCompatibleStyles[0]?.slug || '';

    const isAICompatible = aiCompatibleStyles.some((style) => style.slug === currentStyle);
    return isAICompatible ? currentStyle : aiCompatibleStyles[0]?.slug || '';
  };

  const [selectedStyle, setSelectedStyle] = useState<string>(() =>
    getDefaultAIStyle(presentationImageStyle),
  );

  useEffect(() => {
    if (presentationImageStyle) {
      setSelectedStyle(getDefaultAIStyle(presentationImageStyle));
    }
  }, [presentationImageStyle]);

  return {
    aiCompatibleStyles,
    selectedStyle,
    setSelectedStyle,
  };
};
