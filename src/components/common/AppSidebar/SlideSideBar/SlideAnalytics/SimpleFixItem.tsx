import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { SlideFixItemBase } from './SlideFixItemBase';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { IBulletSlideResult, ITableSlideResult } from '@/hooks/useSlideAnalytics/interfaces';

export const SimpleFixItem = ({
  result,
  loading,
  onFix,
}: {
  result: IBulletSlideResult | ITableSlideResult;
  loading: boolean;
  onFix: () => void;
  onRemove?: () => void;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'analytics' });

  return (
    <SlideFixItemBase
      item={{
        color: result.color,
        title: t(`${result.result}.title`, {
          count:
            result.type === 'bullets' && typeof result.count === 'number'
              ? result?.count
              : undefined,
          index: result.type === 'table' ? result?.index + 1 : undefined,
        }),
        description: t(`${result.result}.description`),
      }}
      // onRemove={result.type === "bullets" ? onRemove : undefined}
    >
      <BaseButton
        variant="outline"
        size="sm"
        classNames={cn('px-3 font-semibold text-[14px] h-8 w-full')}
        onClick={onFix}
        loading={loading}
      >
        {t('fixIt')}
      </BaseButton>
    </SlideFixItemBase>
  );
};
