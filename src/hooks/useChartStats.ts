import { useCallback } from 'react';
import { ChartData } from '../components/PresentationEditor/SlideFactory/Slides/ChartSlide';

interface ChartStats {
  highest: { value: number; name: string };
  lowest: { value: number; name: string };
}

export const useChartStats = (data: ChartData[]) => {
  const getValueStats = useCallback((): ChartStats => {
    if (!data?.length) {
      return {
        highest: { value: 0, name: '' },
        lowest: { value: 0, name: '' },
      };
    }

    const maxItem = data.reduce(
      (acc, item) => ((item.value || 0) > (acc?.value || 0) ? item : acc),
      data[0],
    );

    const minItem = data.reduce(
      (acc, item) => ((item.value || 0) < (acc?.value || Infinity) ? item : acc),
      data[0],
    );

    return {
      highest: { value: maxItem?.value || 0, name: maxItem?.name || '' },
      lowest: { value: minItem?.value || 0, name: minItem?.name || '' },
    };
  }, [data]);

  const getValue2Stats = useCallback((): ChartStats => {
    if (!data?.length || !data[0].value2) {
      return {
        highest: { value: 0, name: '' },
        lowest: { value: 0, name: '' },
      };
    }

    const maxItem = data.reduce(
      (acc, item) => ((item.value2 || 0) > (acc?.value2 || 0) ? item : acc),
      data[0],
    );

    const minItem = data.reduce(
      (acc, item) => ((item.value2 || 0) < (acc?.value2 || Infinity) ? item : acc),
      data[0],
    );

    return {
      highest: { value: maxItem.value2 || 0, name: maxItem.name },
      lowest: { value: minItem.value2 || 0, name: minItem.name },
    };
  }, [data]);

  const getStatsForValueKey = useCallback(
    (key: keyof ChartData): ChartStats => {
      if (!data?.length || data[0][key] === undefined) {
        return {
          highest: { value: 0, name: '' },
          lowest: { value: 0, name: '' },
        };
      }

      const maxItem = data.reduce(
        (acc, item) => ((item[key] as number || 0) > (acc[key] as number || 0) ? item : acc),
        data[0],
      );

      const minItem = data.reduce(
        (acc, item) => ((item[key] as number || 0) < (acc[key] as number || Infinity) ? item : acc),
        data[0],
      );

      return {
        highest: { value: (maxItem[key] as number) || 0, name: maxItem.name },
        lowest: { value: (minItem[key] as number) || 0, name: minItem.name },
      };
    },
    [data],
  );

  return { getValueStats, getValue2Stats, getStatsForValueKey };
};
