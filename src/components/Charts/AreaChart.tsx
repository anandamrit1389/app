import {
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
} from 'recharts';
import { ChartData } from '../PresentationEditor/SlideFactory/Slides/ChartSlide';
import CustomTooltip from './Components/ChartCustomTooltips';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext } from 'react';
import { truncateName, formatYAxis } from './Components/utils';
import { chartColors } from '@/helpers/constants/chart-color.const';

interface IProps {
  data: ChartData[];
  isPresentationSidePreview?: boolean;
  inActionSheet?: boolean;
  isAnimationDisabled?: boolean;
}

const AreaChartComponent = ({
  data,
  isPresentationSidePreview = false,
  inActionSheet = false,
  isAnimationDisabled = false,
}: IProps) => {
  const { theme } = useContext(PresentationContext);
  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];
  const isDark = currentTheme?.templates.includes('dark');

  const formattedData = data.map((item) => ({
    ...item,
    originalName: item.name,
    name: truncateName(item.name),
  }));

  const colors = chartColors.areaChart;
  const valueKeys = Object.keys(data[0] || {}).filter((key) => key.startsWith('value'));

  return (
    <ResponsiveContainer width="100%" height="100%" className={'text-normalTextFontSize'}>
      <AreaChart data={formattedData}>
        <CartesianGrid strokeDasharray="3" vertical={true} horizontal={true} />
        {!isPresentationSidePreview && (
          <XAxis dataKey="name" textAnchor="end" height={60} angle={-20} />
        )}
        {!isPresentationSidePreview && <YAxis tickFormatter={formatYAxis} />}
        {valueKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            fill={colors[i % colors.length]}
            stroke={colors[i % colors.length]}
            isAnimationActive={!isAnimationDisabled}
            className={`transition-colors duration-100 ${
              isDark ? 'hover:fill-white/92' : 'hover:fill-black/8'
            }`}
          />
        ))}
        {!isPresentationSidePreview && (
          <Tooltip content={<CustomTooltip inActionSheet={inActionSheet} colors={colors} />} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
