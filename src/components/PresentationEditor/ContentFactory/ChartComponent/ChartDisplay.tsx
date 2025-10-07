import { ChartData, ChartType } from '../../SlideFactory/Slides/ChartSlide';
import { ISlide } from '@/interfaces/ISlides';
import ChartComponent from './ChartComponent';

interface ChartDisplayProps {
  type: ChartType;
  data: ChartData[];
  isPreview?: boolean;
  isMobile?: boolean;
  handleUpdateType: (type: ChartType) => void;
  handleUpdateData: (data: ChartData[], index: number) => void;
  isPresentationSidePreview?: boolean;
  presentationModeSlideIndex?: number;
  slide: ISlide;
  chartIndex: number;
  variation: {
    chartContainerClassName?: string;
    chartClassName?: string;
  };
}

export const ChartDisplay = ({
  type,
  data,
  isPreview,
  isMobile,
  handleUpdateType,
  handleUpdateData,
  isPresentationSidePreview,
  presentationModeSlideIndex,
  slide,
  chartIndex,
  variation,
}: ChartDisplayProps) => (
  <div className={variation?.chartClassName}>
    <ChartComponent
      type={type}
      data={data}
      isPreview={isPreview}
      isMobile={isMobile}
      handleUpdateType={handleUpdateType}
      handleUpdateData={(data) => handleUpdateData(data, chartIndex)}
      isPresentationSidePreview={isPresentationSidePreview}
      presentationModeSlideIndex={presentationModeSlideIndex}
      slide={slide}
      chartIndex={chartIndex}
    />
  </div>
);

export default ChartDisplay;
