import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { SlideFixItemBase } from './SlideFixItemBase';
import AIStar from '@/assets/ai-star-black.svg?react';
import { useTranslation } from 'react-i18next';
import { IImageResult } from '@/hooks/useSlideAnalytics/interfaces';

export const ImageFixItem = ({
  result,
  loading,
  onUpscale,
  onOpenImageOptionSidebar,
  onRemove,
}: {
  result: IImageResult;
  loading: boolean;
  onUpscale?: () => void;
  onOpenImageOptionSidebar: () => void;
  onRemove: () => void;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'analytics' });

  return (
    <SlideFixItemBase
      item={{
        color: result.color,
        title: t(`${result.result}.title`),
        description: t(`${result.result}.description`),
        image: ['lowRes', 'unusualAspectRatio'].includes(result.result) ? result.image : undefined,
      }}
      onRemove={result.result === 'imageLoadError' ? undefined : onRemove}
    >
      <BaseButton
        variant="outline"
        size="sm"
        classNames="px-3 font-semibold text-[14px] h-8 w-full"
        onClick={onOpenImageOptionSidebar}
      >
        {t('replace')}
      </BaseButton>
      {onUpscale && (
        <BaseButton
          variant="outline"
          size="sm"
          classNames="px-3 font-semibold text-[14px] h-8"
          onClick={onUpscale}
          loading={loading}
        >
          <AIStar />
          {t('upscale')}
        </BaseButton>
      )}
    </SlideFixItemBase>
  );
};
