import { ChartType } from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';

export const chartColors = {
  lineGraph: ['#E02A5C', '#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],
  barGraph: ['#E02A5C', '#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],
  pieChart: ['#E02A5C', '#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],
  donutChart: ['#E02A5C', '#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],
  areaChart: ['#E02A5C', '#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'],
};

export const chartSlideType = (chartType: ChartType) => {
  switch (chartType) {
    case 'line-graph':
      return 'lineGraph';
    case 'bar-graph':
      return 'barGraph';
    case 'pie-chart':
      return 'pieChart';
    case 'donut-chart':
      return 'donutChart';
    case 'area-chart':
      return 'areaChart';
    default:
      return 'lineGraph';
  }
};
