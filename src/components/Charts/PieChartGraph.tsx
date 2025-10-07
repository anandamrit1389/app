import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartData } from '../PresentationEditor/SlideFactory/Slides/ChartSlide';
import CustomTooltip from './Components/ChartCustomTooltips';
import ChartCustomLegend from './Components/ChartCustomLegend';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { useContext, useMemo } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { chartColors } from '@/helpers/constants/chart-color.const';
import { getRandomColors } from './Components/utils';

interface IProps {
  data: ChartData[];
  isPresentationSidePreview?: boolean;
  inActionSheet?: boolean;
  isAnimationDisabled?: boolean;
}

const PieChartGraph = ({
  data,
  isPresentationSidePreview = false,
  inActionSheet = false,
  isAnimationDisabled = false,
}: IProps) => {
  const { theme } = useContext(PresentationContext);
  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];
  const isDark = currentTheme?.templates.includes('dark');

  const valueKeys = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter((key) => key.startsWith('value'));
  }, [data]);

  const chartSeries = useMemo(() => {
    return valueKeys.map((key) => {
      const entries = data.filter((d) => d[key as any] > 0);
      const colors = getRandomColors(chartColors.pieChart, entries.length);
      return {
        key,
        data: entries.map((entry, i) => ({
          name: entry.name,
          value: entry[key as any] as number,
          originalName: entry.name,
          fill: colors[i % colors.length],
        })),
        colors,
      };
    });
  }, [data, valueKeys]);

  const allColors = chartSeries.flatMap((s) => s.colors);

  return (
    <ResponsiveContainer width="100%" height="100%" className={'text-normalTextFontSize'}>
      <PieChart>
        {chartSeries.map((series, index) => (
          <Pie
            key={series.key}
            data={series.data}
            labelLine={false}
            dataKey="value"
            isAnimationActive={!isAnimationDisabled}
            outerRadius={`${80 - index * 10}%`}
            innerRadius={index === 0 ? 0 : `${80 - (index + 1) * 10}%`}
            cx="50%"
            cy="50%"
          >
            {series.data.map((entry, i) => (
              <Cell
                key={`cell-${series.key}-${i}`}
                fill={entry.fill}
                className={`transition-colors duration-100 ${
                  isDark ? 'hover:fill-white/92' : 'hover:fill-black/8'
                }`}
                style={{ outline: 'none' }}
              />
            ))}
          </Pie>
        ))}

        {!isPresentationSidePreview && (
          <Tooltip
            content={
              <CustomTooltip 
                inActionSheet={inActionSheet} 
                colors={allColors} 
              />
            }
          />
        )}
        {!isPresentationSidePreview && <Legend content={<ChartCustomLegend />} />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartGraph;
