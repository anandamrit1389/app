import React from 'react';
import usePaginatedData from '@/hooks/usePaginatedData';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { TFunction } from 'i18next';

type FetchParams = { page?: number; limit?: number; [k: string]: any };

interface PaginatedListSectionProps<T> {
  t: TFunction;
  keyPrefix?: string;
  titleKey?: string;
  fetchPage: (params: FetchParams) => Promise<T[]> | any;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  pageSize?: number;
  deps?: any[];
  empty?: React.ReactNode;
  containerClassName?: string;
  isHeader?: boolean;
}

export const PaginatedListSection = <T,>({
  t,
  keyPrefix,
  titleKey,
  fetchPage,
  keyExtractor,
  renderItem,
  pageSize = 10,
  deps = [],
  empty = null,
  containerClassName = '',
  isHeader = true,
}: PaginatedListSectionProps<T>) => {
  const tt = (k: string) => (keyPrefix ? t(`${keyPrefix}.${k}`) : t(k));

  const { data, isLoading, loadMore, hasMore } = usePaginatedData<T>(
    (params) => fetchPage(params),
    keyExtractor,
    {},
    pageSize,
    { deps },
  );

  return (
    <>
      {isHeader && (
        <div className="flex justify-between rounded-lg bg-[#F6F7FA] px-4 pl-10 py-3 text-[16px] font-semibold text-darkHeadline">
          {titleKey && <p>{tt(titleKey)}</p>}
        </div>
      )}

      <div className={`flex w-full flex-col gap-2 overflow-auto ${containerClassName}`}>
        {data.length === 0 && !isLoading
          ? empty
          : data.map((item) => (
              <React.Fragment key={keyExtractor(item)}>{renderItem(item)}</React.Fragment>
            ))}

        {hasMore && (
          <BaseButton
            onClick={loadMore}
            disabled={isLoading}
            loading={isLoading}
            variant="outline"
            classNames="p-3 text-[16px]"
          >
            {tt('loadMoreBtn')}
          </BaseButton>
        )}
      </div>
    </>
  );
};
