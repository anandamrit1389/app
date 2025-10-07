import { useContext, useEffect, useRef, useState } from 'react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import AIStar from '@/assets/ai-stars-1.svg?react';
import ArrowBack from '@/assets/arrow-back.svg?react';
import ChartActions from './ChartActions/ChartAction';
import { useTranslation } from 'react-i18next';
import ColChart from '@/components/Charts/ColChart';
import DonutChart from '@/components/Charts/DonutChart';
import PieChartGraph from '@/components/Charts/PieChartGraph';
import LineGraph from '@/components/Charts/LineGraph';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChartData, ChartType } from '../../SlideFactory/Slides/ChartSlide';
import EditDataComponent from './ChartActions/EditDataComponent';
import { PresentationContext } from '@/contexts/Presentation.context';
import { ISlide } from '@/interfaces/ISlides';
import { getPageWithOffset } from '@/helpers/utils/agenda';
import AreaChartComponent from '@/components/Charts/AreaChart';

interface IProps {
  data: ChartData[] | null | undefined;
  type: ChartType | null | undefined;
  className?: string;
  isPreview?: boolean;
  showPromActions?: boolean;
  onActions?: (val: boolean) => void;
  isMobile?: boolean;
  isPresentationSidePreview?: boolean;
  handleUpdateData: (data: ChartData[], chartIndex: number) => void;
  handleUpdateType: (type: ChartType) => void;
  presentationModeSlideIndex?: number;
  slide: ISlide;
  chartIndex?: number;
}

const ChartComponent = ({
  data,
  type,
  className,
  isPreview,
  showPromActions = true,
  handleUpdateData,
  handleUpdateType,
  isMobile = false,
  isPresentationSidePreview = false,
  presentationModeSlideIndex,
  slide,
  chartIndex = 0,
  onActions,
}: IProps) => {
  const [chartData, setChartData] = useState<ChartData[]>(data || []);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDataEditing, setIsDataEditing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, presentation, showAgenda } = useContext(PresentationContext);
  const [dataToDisplay, setDataToDisplay] = useState<ChartData[]>(data || []);

  const pageNumber = presentation ? getPageWithOffset(presentation.slides, slide, showAgenda) : 0;

  useEffect(() => {
    setDataToDisplay(data || []);
  }, [data]);

  useEffect(() => {
    onActions?.(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (!type) {
      // set default type
      handleUpdateType('bar-graph');
    }
  }, []);

  const handleIsDataEditingChange = (value: boolean) => {
    handleUpdateData(chartData, chartIndex);
    setIsDataEditing(value);
  };

  useEffect(() => {
    if (presentationModeSlideIndex != null) {
      if (pageNumber == presentationModeSlideIndex + 1) {
        setDataToDisplay(data || []);
      } else {
        setDataToDisplay([]);
      }
    }
  }, [presentationModeSlideIndex]);

  useEffect(() => {
    if (isFullscreen) {
      setDataToDisplay(data || []);
    }
  }, [isFullscreen]);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleClick = () => {
    if (!isPreview) {
      setIsEditing(true);
    }
  };

  const handleActions = (event: React.MouseEvent) => {
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  const handleisEditingClick = (event: MouseEvent) => {
    if (isMobile) return;
    if (buttonRef.current && buttonRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    if (chartRef.current && chartRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setIsEditing(false);
  };

  const getChart = ({
    inActionSheet = false,
    isAnimationDisabled = false,
  }: { inActionSheet?: boolean; isAnimationDisabled?: boolean } = {}) => {
    if (!data || data.length == 0) {
      return (
        <p className="flex size-full items-center justify-center text-center text-normalTextFontSize font-bold text-normalText">
          No data to display
        </p>
      );
    } else {
      switch (type) {
        case 'line-graph':
          return (
            <LineGraph
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
        case 'bar-graph':
          return (
            <ColChart
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
        case 'pie-chart':
          return (
            <PieChartGraph
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
        case 'donut-chart':
          return (
            <DonutChart
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
        case 'area-chart':
          return (
            <AreaChartComponent
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
        default:
          return (
            <ColChart
              isAnimationDisabled={isAnimationDisabled}
              data={dataToDisplay}
              isPresentationSidePreview={isPresentationSidePreview}
              inActionSheet={inActionSheet}
            />
          );
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleisEditingClick);

    return () => {
      document.removeEventListener('click', handleisEditingClick);
    };
  }, []);

  const addNewRow = () => {
    setChartData((prev) => {
      if (prev.length === 0) {
        return [{ name: '', value: 0 }];
      }

      const keys = Object.keys(prev[0]) as Array<keyof ChartData>;
      const newRow = keys.reduce((acc, key) => {
        if (key === 'name') {
          acc[key] = '';
        } else {
          acc[key] = 0;
        }
        return acc;
      }, {} as ChartData);

      return [...prev, newRow];
    });
  };

  const addNewColumn = () => {
    setChartData((prev) => {
      return prev.map((item) => {
        const newItem = { ...item };

        const valueKeys = Object.keys(item).filter((key) => key.startsWith('value'));
        const newIndex = valueKeys.length;
        const newKey = newIndex === 0 ? 'value' : `value${newIndex}`;

        newItem[newKey as any] = 0;

        return newItem;
      });
    });
  };

  const deleteRow = (index: number) => {
    const updatedData = chartData.filter((_, i) => i !== index);
    setChartData(updatedData);
  };

  const deleteColumn = (keyToDelete: string) => {
  const updated = chartData.map((item) => {
    const newItem: any = {};

    Object.keys(item).forEach((key) => {
      if (!key.startsWith('value')) {
        newItem[key] = item[key as keyof ChartData];
      }
    });

    const valueKeys = Object.keys(item)
      .filter((key) => key.startsWith('value'))
      .sort((a, b) => {
        const getIndex = (k: string) => (k === 'value' ? 0 : parseInt(k.replace('value', '')));
        return getIndex(a) - getIndex(b);
      });

    let newIndex = 0;
    for (const key of valueKeys) {
      if (key === keyToDelete) continue;

      const newKey = newIndex === 0 ? 'value' : `value${newIndex}`;
      newItem[newKey] = item[key as keyof ChartData];
      newIndex++;
    }

    return newItem;
  });

  setChartData(updated);
};

  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedData = [...chartData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: field === 'name' ? value as string : +value,
    };
    setChartData(updatedData);
  };

  const handleUpdateChartData = () => {
    const updatedData: ChartData[] = chartData.map((item) => {
      const newItem: ChartData = {
        name: item.name,
        value: item.value ?? 0,
      };

      Object.keys(item).forEach((key) => {
        if (key.includes('value')) {
          const typedKey = key as `value${number}`;
          newItem[typedKey] = item[typedKey] ?? 0;
        }
      });

      return newItem;
    });
    
    handleUpdateData(updatedData, chartIndex);
    setIsDataEditing(false);
  };

  if (isMobile) {
    return (
      <>
        <div
          onClick={handleClick}
          ref={chartRef}
          className={`my-4 mr-3 aspect-square ${
            isEditing
              ? 'rounded-sm outline outline-1 outline-offset-8 outline-grey/25'
              : 'outline-none'
          }
            ${type == 'bar-graph' || type == 'line-graph' ? 'pt-10' : ''} `}
        >
          {getChart()}
        </div>

        <Sheet open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <SheetContent
            outsideclose="true"
            side="right"
            className="flex h-dvh w-full flex-col items-start justify-start bg-lightGrey p-0"
          >
            <Button variant={'ghost'} className="mt-3" onClick={() => setIsEditing(false)}>
              <ArrowBack />
            </Button>
            <SheetTitle className="hidden">{t('input')}</SheetTitle>

            {getChart({ inActionSheet: true })}

            <ChartActions
              isOpen={false}
              onClose={() => setIsOpen(false)}
              x={menuPosition.x}
              y={menuPosition.y}
              setIsDataEditing={setIsDataEditing}
              setIsOpen={setIsOpen}
              handleUpdateChartType={handleUpdateType}
              mobile
            />
          </SheetContent>
        </Sheet>

        <EditDataComponent
          isDataEditing={isDataEditing}
          setIsDataEditing={handleIsDataEditingChange}
          chartData={chartData}
          addNewRow={addNewRow}
          addNewCol={addNewColumn}
          handleUpdateChartData={handleUpdateChartData}
          deleteRow={deleteRow}
          deleteColumn={deleteColumn}
          handleInputChange={handleInputChange}
          modal={false}
        />
      </>
    );
  }

  if (!isPreview) {
    return (
      <>
        <div className={`${className} relative flex h-[100%] w-[100%] items-center`}>
          <div
            onClick={handleClick}
            ref={chartRef}
            className={` h-full w-full mx-auto ${
              isEditing
                ? 'rounded-sm outline outline-1 outline-offset-8 outline-grey/25'
                : 'outline-none'
            }`}
          >
            {getChart({ isAnimationDisabled: true })}
          </div>
          {showPromActions && !isMobile && isEditing && (
            <div ref={buttonRef} className="absolute left-[17%] top-[-25px] z-30">
              <ChartActions
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                x={menuPosition.x}
                y={menuPosition.y}
                setIsDataEditing={setIsDataEditing}
                setIsOpen={setIsOpen}
                handleUpdateChartType={handleUpdateType}
              />
              <BaseButton
                variant="secondary"
                classNames="rounded-full size-12 p-0 shadow-xl"
                onClick={handleActions}
              >
                <AIStar />
              </BaseButton>
            </div>
          )}
          <EditDataComponent
            isDataEditing={isDataEditing}
            setIsDataEditing={handleIsDataEditingChange}
            chartData={chartData}
            addNewRow={addNewRow}
            addNewCol={addNewColumn}
            handleUpdateChartData={handleUpdateChartData}
            deleteRow={deleteRow}
            deleteColumn={deleteColumn}
            handleInputChange={handleInputChange}
          />
        </div>
      </>
    );
  }

  return (
    <div onClick={handleClick} ref={chartRef} className="w-full h-full">
      {getChart()}
    </div>
  );
};

export default ChartComponent;
