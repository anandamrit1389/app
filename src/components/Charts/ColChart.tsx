import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartData } from '../PresentationEditor/SlideFactory/Slides/ChartSlide';
import { truncateName, formatYAxis } from './Components/utils';
import CustomTooltip from './Components/ChartCustomTooltips';
import { chartColors } from '@/helpers/constants/chart-color.const';
import { useEffect, useState } from 'react';

interface IProps {
  data: ChartData[];
  isPresentationSidePreview?: boolean;
  inActionSheet?: boolean;
  isAnimationDisabled?: boolean;
}

const ColChart = ({
  data,
  isPresentationSidePreview = false,
  inActionSheet = false,
  isAnimationDisabled = false,
}: IProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    originalName: item.name,
    name: truncateName(item.name),
  }));
  const [textColor, setTextColor] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [hoveredBars, setHoveredBars] = useState<boolean[]>([]);

  const valueKeys = data.length > 0
    ? Object.keys(data[0]).filter((key) => key.startsWith('value'))
    : [];

  const colors = chartColors.barGraph;

  useEffect(() => {
    setHoveredBars(new Array(valueKeys.length).fill(false));
  }, [valueKeys.length]);

  useEffect(() => {
    const themeElement = document.querySelector("[class*='theme-']:not(.preview)");
    if (!themeElement) return;

    const updateVars = () => {
      const style = getComputedStyle(themeElement);
      setTextColor(style.getPropertyValue('--normalText').trim());
      setFontSize(style.getPropertyValue('--bulletPointText').trim());
    };

    updateVars();

    const resizeObserver = new ResizeObserver(() => {
      updateVars();
    });

    resizeObserver.observe(themeElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredBars((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const handleMouseLeave = (index: number) => {
    setHoveredBars((prev) => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%" className={'text-normalTextFontSize'}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3" vertical={false} horizontal={true} />
        {!isPresentationSidePreview && (
          <XAxis {...(textColor && { tick: { fill: textColor, fontSize: fontSize } })} dataKey="name" textAnchor="end" height={60} angle={-10} />
        )}
        {!isPresentationSidePreview && <YAxis {...(textColor && { tick: { fill: textColor, fontSize } })} tickFormatter={formatYAxis} />}
        {!isPresentationSidePreview && (
          <Tooltip content={<CustomTooltip inActionSheet={inActionSheet} colors={colors} />} />
        )}
        {valueKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[i % colors.length]}
            radius={[8, 8, 0, 0]}
            isAnimationActive={!isAnimationDisabled}
            activeBar={
              hoveredBars[i]
                ? { fill: `${colors[i % colors.length]}CC` }
                : { fill: colors[i % colors.length] }
            }
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ColChart;
