import { useContext, memo } from 'react';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { variations } from './variations/chart-slide';
import { useChartData } from '@/hooks/useChartData';
import { useChartStats } from '@/hooks/useChartStats';
import StatSection from '../../ContentFactory/ChartComponent/StatSection';
import ChartDisplay from '../../ContentFactory/ChartComponent/ChartDisplay';
import ChartComponent from '../../ContentFactory/ChartComponent/ChartComponent';
import { chartColors, chartSlideType } from '@/helpers/constants/chart-color.const';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

export interface ChartData {
  name: string;
  value: number;
  [key: `value${number}`]: number;
}

export type ChartType = 'pie-chart' | 'line-graph' | 'bar-graph' | 'donut-chart' | 'area-chart';

interface ISlideWithChartData extends Omit<ISlide, 'chartData'> {
  chartData?: ChartData[][] | null;
  chartType: ChartType;
}

const ChartSlide = ({
  slide,
  isPreview,
  mobile,
  isPresentationSidePreview = false,
  presentationModeSlideIndex,
}: {
  slide: ISlideWithChartData;
  isPreview?: boolean;
  mobile?: boolean;
  isPresentationSidePreview?: boolean;
  presentationModeSlideIndex?: number;
}) => {
  const variation = getSlideVariation(variations, slide.variation);
  const { updateSlide, currentElement, selectedLanguage, originLanguage, updateContent } = useContext(PresentationContext);
  
  const chartData = useChartData(slide.chartData || null);

  const handleUpdateChartType = (type: ChartType) => {
    updateSlide?.({ ...slide, chartType: type } as ISlideWithChartData);
  };

  const handleUpdateField = (val: string, field: 'title' | 'subtitle') => {
    const updSlide = updateTranslatableField(
      slide,
      field,
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );

    updateSlide?.(updSlide);
  };

  const handleUpdateContent = (val: string, id: string, field: 'title' | 'text') => {
    const content = slide.content.find((c) => c.id === id);

    if (content) {
      const updContent = updateTranslatableField(
        content,
        field,
        val,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );
  
      updateContent?.(updContent, slide.id);
    }
  };

  const handleUpdateChartData = (data: ChartData[], chartIndex: number) => {
    const currentData = slide.chartData;
    let updatedChartData: ChartData[][] | ChartData[];

    if (Array.isArray(currentData?.[0])) {
      updatedChartData = [...(currentData || [])];
      updatedChartData[chartIndex] = data;
    } else {
      updatedChartData = data;
    }

    updateSlide?.({
      ...slide,
      chartData: updatedChartData,
    } as ISlideWithChartData);
  };

  // const handleUpdateText = (val: string, id: string, isTitle: boolean) => {
  //   const content = slide.content.find((c) => c.id === id);
  //   if (content) {
  //     const updContent = {
  //       ...content,
  //       title: isTitle ? val : content.title,
  //       text: isTitle ? content.text : val,
  //     };
  //     updateSlide({
  //       ...slide,
  //       content: slide.content?.map((c) => c.id === updContent.id ? updContent : c),
  //     } as ISlideWithChartData);
  //   }
  // };

  const StatDisplay = ({ data, chartType }: { data: ChartData[]; chartType: ChartType }) => {
    const { getStatsForValueKey } = useChartStats(data); 
    
    const valueKeys = data.length > 0
      ? Object.keys(data[0]).filter((key) => key.startsWith('value'))
      : [];

    if (valueKeys.length > 1) return;

    const color = chartColors[chartSlideType(chartType)];

    const key = valueKeys[0];
    const stats = getStatsForValueKey(key as keyof ChartData);

    return (
      <div className={variation?.statsContainerClassName}>
        <StatSection
          stats={stats}
          color={color[0]}
          variation={variation || {}}
        />
      </div>
    );
  };

  // During loading/generation state
  if (currentElement?.slideId === slide.id) {
    return (
      <div className={variation?.pageContainerClassName}>
        <AnimatedText
          classNames={variation?.slideHeadingClassName}
          text={slide.titleTranslations?.[selectedLanguage] ?? slide.title ?? ''}
          speed={20}
          skipSwitch={isPreview}
        />
        <AnimatedText
          classNames={variation?.subtitleClassName}
          text={slide.subtitleTranslations?.[selectedLanguage] ?? slide?.subtitle ?? ''}
          speed={20}
          skipSwitch={isPreview}
        />
        <div className={variation?.containerClassName}>
          {chartData?.map((data, index) => (
            <>
              <div key={index} className={variation?.chartContainerClassName}>
                <div className={variation?.chartClassName}>
                  <ChartComponent
                    type={slide.chartType}
                    data={data}
                    isPreview
                    isMobile={mobile}
                    handleUpdateType={() => {}}
                    handleUpdateData={() => {}}
                    isPresentationSidePreview={isPresentationSidePreview}
                    presentationModeSlideIndex={slide.slideNumber - 1}
                    slide={slide}
                  />
                </div>
                <div className={variation?.textContainerClassName}>
                  <AnimatedText
                    speed={100}
                    text={slide.content[index]?.title || ''}
                    classNames={variation?.plainTextClassName}
                    delay={100}
                    skipSwitch={isPreview}
                  />
                  <div className={variation?.statsContainerClassName}>
                    <div className={variation?.statsClassName}>
                      <div className="flex items-center gap-1">
                        <div className="size-bulletPoint rounded-full bg-primary-600"></div>
                        <div className={`${variation?.statsTextClassName}`}>
                          <AnimatedText speed={100} text="Value" delay={150} skipSwitch={isPreview} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-content">
                        <div>
                          <div className={`${variation?.statsTextClassName}`}>
                            <AnimatedText
                              speed={100}
                              text="Highest"
                              delay={200}
                              skipSwitch={isPreview}
                            />
                          </div>
                          <div className={`${variation?.statsValueClassName}`}>
                            <AnimatedText speed={100} text="0" delay={250} skipSwitch={isPreview} />
                          </div>
                        </div>
                        <div>
                          <div className={`${variation?.statsTextClassName}`}>
                            <AnimatedText
                              speed={100}
                              text="Lowest"
                              delay={300}
                              skipSwitch={isPreview}
                            />
                          </div>
                          <div className={`${variation?.statsValueClassName}`}>
                            <AnimatedText speed={100} text="0" delay={350} skipSwitch={isPreview} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <TextComponent
                    className={`${variation?.statsTextClassName} font-semibold`}
                    content={slide.content[index]?.text || ''}
                    isPreview={isPreview}
                    chartSlide={true}
                    chartType={slide.chartType}
                  />
                </div>
              </div>
              {variation?.type.includes('WithText') && 
                <div className={variation?.subTextContainerClassName}>
                  {slide.content?.map((content, index) => {
                    return (
                      <div key={content.id} className={`${index === 0 ? 'row-span-2' : ''}`}>
                        <AnimatedText
                          classNames={`${variation?.plainTextClassName}`}
                          text={content.textTranslations?.[selectedLanguage] ?? content?.text}
                          speed={20}
                          skipSwitch={isPreview}
                        />
                      </div>
                    );
                  })}
                </div>
              }
            </>
          ))}
        </div>
      </div>
    );
  }

  // Normal render state
  return (
    <div className={variation?.pageContainerClassName}>
      <TextComponent 
        isPreview={isPreview}
        className={`${variation?.slideHeadingClassName}`}
        content={slide.titleTranslations?.[selectedLanguage] ?? slide?.title}
        onUpdate={(val) => handleUpdateField(val, 'title')}
      />
      <TextComponent
        isPreview={isPreview}
        className={`${variation?.subtitleClassName}`}
        content={slide.subtitleTranslations?.[selectedLanguage] ?? slide?.subtitle}
        onUpdate={(val) => handleUpdateField(val, 'subtitle')}
      />
      <div className={variation?.containerClassName}>
        {chartData.map((data, index) => (
          <>
            <div key={`chart-${index}`} className={variation?.chartContainerClassName}>
              <ChartDisplay
                type={slide.chartType}
                data={data}
                isPreview={isPreview}
                isMobile={mobile}
                handleUpdateType={handleUpdateChartType}
                handleUpdateData={handleUpdateChartData}
                isPresentationSidePreview={isPresentationSidePreview}
                presentationModeSlideIndex={presentationModeSlideIndex}
                slide={slide}
                chartIndex={index}
                variation={variation || {}}
              />
              <div className={variation?.textContainerClassName}>
                <TextComponent
                  className={variation?.statsTitleClassName}
                  content={
                    slide.content[index]?.titleTranslations?.[selectedLanguage] ??
                    slide.content[index]?.title ??
                    ''
                  }
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateContent(val, slide.content[index]?.id, 'title')}
                />
                <StatDisplay data={data} chartType={slide.chartType} />
                {!variation?.type.includes('WithText') && 
                  <TextComponent
                    className={`${variation?.plainTextClassName}`}
                    content={slide.content[index]?.text || ''}
                    onUpdate={(val) => handleUpdateContent(val, slide.content[index]?.id, 'text')}
                    chartSlide
                    chartType={slide.chartType}
                    isPreview={isPreview}
                  />
                }
              </div>
            </div>
            {variation?.type.includes('WithText') && 
              <div className={variation?.subTextContainerClassName}>
                {slide.content?.map((content, index) => {
                  return (
                    <div key={content.id} className={`${index === 0 ? 'row-span-2' : ''}`}>
                      <TextComponent
                        isPreview={isPreview}
                        className={`${variation?.plainTextClassName}`}
                        content={content.textTranslations?.[selectedLanguage] ?? content?.text}
                        onUpdate={(val) => handleUpdateContent(val, content.id, 'text')}
                      />
                    </div>
                  );
                })}
              </div>
            }
          </>
        ))}
      </div>
    </div>
  );
};

export default memo(ChartSlide);
