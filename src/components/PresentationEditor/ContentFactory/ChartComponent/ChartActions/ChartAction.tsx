import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import FloatingContainer from '@/components/FloatingContainer/FloatingContainer';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import BarGraph from '@/assets/charts-slide.svg?react';
import DonutChart from '@/assets/donut-chart.svg?react';
import PieChart from '@/assets/pie-chart.svg?react';
import LineChart from '@/assets/line-chart.svg?react';
import EditData from '@/assets/edit.svg?react';
import ChevronRight from '@/assets/chevron-right.svg?react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChartType } from '../../../SlideFactory/Slides/ChartSlide';

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  x?: number;
  y?: number;
  mobile?: boolean;
  setIsDataEditing: (val: boolean) => void;
  setIsOpen: (val: boolean) => void;
  handleUpdateChartType: (type: ChartType) => void;
}

const ChartActions = ({
  isOpen,
  onClose,
  x,
  y,
  mobile,
  setIsDataEditing,
  setIsOpen,
  handleUpdateChartType,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  if (mobile) {
    return (
      <div className="w-full rounded-t-2xl bg-white shadow-lg">
        <Sheet>
          <SheetTrigger className="w-full">
            <BaseButton variant="ghost" classNames="text-darkGrey w-full justify-between">
              <div className="flex w-full items-center gap-2">{t('changeChart')}</div>
              <ChevronRight />
            </BaseButton>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetTitle className="hidden">Tonality options</SheetTitle>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => handleUpdateChartType('bar-graph')}
            >
              <BarGraph /> {t('barGraph')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => handleUpdateChartType('donut-chart')}
            >
              <DonutChart /> {t('donutChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => handleUpdateChartType('pie-chart')}
            >
              <PieChart /> {t('pieChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => handleUpdateChartType('line-graph')}
            >
              <LineChart /> {t('lineChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => handleUpdateChartType('area-chart')}
            >
              <LineChart /> {t('areaChart')}
            </BaseButton>
          </SheetContent>
        </Sheet>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start"
          onClick={() => {
            setIsDataEditing(true);
            setIsOpen(false);
          }}
        >
          <EditData /> {t('editData')}
        </BaseButton>
      </div>
    );
  }

  return (
    <FloatingContainer x={x ?? 0} y={y ?? 0} onClose={() => onClose?.()} isOpen={isOpen}>
      <div className="w-[200px] rounded-lg bg-white shadow-lg">
        <HoverCard>
          <HoverCardTrigger>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full flex justify-between pe-2 font-normal p-3"
            >
              <div className="flex w-full items-center justify-start gap-1">
                <span>{t('changeChart')}</span>
              </div>
              <ChevronRight />
            </BaseButton>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="p-0">
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => handleUpdateChartType('bar-graph')}
            >
              <BarGraph /> {t('barGraph')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => handleUpdateChartType('donut-chart')}
            >
              <DonutChart /> {t('donutChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => handleUpdateChartType('pie-chart')}
            >
              <PieChart /> {t('pieChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => handleUpdateChartType('line-graph')}
            >
              <LineChart /> {t('lineChart')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => handleUpdateChartType('area-chart')}
            >
              <LineChart /> {t('areaChart')}
            </BaseButton>
          </HoverCardContent>
        </HoverCard>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start font-normal p-3"
          onClick={() => {
            setIsDataEditing(true);
            setIsOpen(false);
          }}
        >
          <EditData /> {t('editData')}
        </BaseButton>
      </div>
    </FloatingContainer>
  );
};

export default ChartActions;
