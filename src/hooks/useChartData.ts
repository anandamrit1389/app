import { useMemo } from 'react';
import { ChartData } from '../components/PresentationEditor/SlideFactory/Slides/ChartSlide';

export const useChartData = (slideChartData: ChartData[][] | ChartData[] | null) => {
  return useMemo(() => {
    if (!slideChartData) return [[]];
    if (Array.isArray(slideChartData[0])) {
      return slideChartData as ChartData[][];
    }
    return [slideChartData as ChartData[]];
  }, [slideChartData]);
};
