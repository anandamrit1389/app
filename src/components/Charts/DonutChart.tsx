import {
  Tooltip,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../PresentationEditor/SlideFactory/Slides/ChartSlide';
import CustomTooltip from './Components/ChartCustomTooltips';
import ChartCustomLegend from './Components/ChartCustomLegend';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useMemo } from 'react';
import { chartColors } from '@/helpers/constants/chart-color.const';
import { getRandomColors } from './Components/utils';

interface IProps {
  data: ChartData[];
  isPresentationSidePreview?: boolean;
  inActionSheet?: boolean;
  isAnimationDisabled?: boolean;
  hideLegend?: boolean;
}

const DonutChart = ({
  data,
  isPresentationSidePreview = false,
  inActionSheet = false,
  isAnimationDisabled = false,
  hideLegend = false,
}: IProps) => {
  const { theme } = useContext(PresentationContext);
  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];
  const isDark = currentTheme?.templates.includes('dark');

  const valueKeys = useMemo(
    () =>
      data.length > 0
        ? Object.keys(data[0]).filter((key) => key.startsWith('value'))
        : [],
    [data]
  );

  const colors = useMemo(() => {
    const allColors = chartColors.donutChart;
    return getRandomColors(allColors, valueKeys.length);
  }, [valueKeys.length]);

  const chartData = useMemo(() => {
    return valueKeys.map((key, seriesIndex) =>
      data
        .filter((entry) => entry[key as keyof ChartData] && (entry[key as keyof ChartData] as number) > 0)
        .map((entry) => ({
          name: entry.name,
          value: entry[key as keyof ChartData] as number,
          originalName: entry.name,
          fill: colors[seriesIndex % colors.length],
          key,
        }))
    );
  }, [data, valueKeys, colors]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="40%"
        innerRadius="30%"
        outerRadius="70%"
        barSize={20}
        data={chartData} 
        startAngle={90}
        endAngle={-270}
      >
        {chartData.map((series, index) => (
          <RadialBar
            key={`radial-bar-${index}`}
            data={series}
            dataKey="value"
            background
            cornerRadius={30}
            isAnimationActive={!isAnimationDisabled}
            className={`transition-colors duration-100 ${
              isDark ? 'hover:fill-white/92' : 'hover:fill-black/8'
            }`}
          />
        ))}

        {!isPresentationSidePreview && (
          <Tooltip
            content={
              <CustomTooltip
                inActionSheet={inActionSheet}
                colors={colors}
              />
            }
          />
        )}

        {!isPresentationSidePreview && !hideLegend && (
          <Legend
            content={<ChartCustomLegend />}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '40px',
              width: '100%',
            }}
          />
        )}
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
