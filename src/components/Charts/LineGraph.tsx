import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LineChart, Line } from 'recharts';
import { ChartData } from '../PresentationEditor/SlideFactory/Slides/ChartSlide';
import CustomTooltip from './Components/ChartCustomTooltips';
import { truncateName, formatYAxis } from './Components/utils';
import { chartColors } from '@/helpers/constants/chart-color.const';

interface IProps {
  data: ChartData[];
  isPresentationSidePreview?: boolean;
  inActionSheet?: boolean;
  isAnimationDisabled?: boolean;
}

export const LineGraph = ({
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

  const colors = chartColors.lineGraph;

  return (
    <ResponsiveContainer width="100%" height="100%" className={'text-normalTextFontSize'}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3" vertical={true} horizontal={true} />
        {!isPresentationSidePreview && (
          <XAxis dataKey="name" angle={-10} textAnchor="end" height={60} />
        )}
        {!isPresentationSidePreview && <YAxis tickFormatter={formatYAxis} />}
        {data?.length > 0 && Object.keys(data[0])
          .filter((key) => key.startsWith('value'))
          .map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              activeDot={false}
              dot={!isPresentationSidePreview}
              strokeWidth={isPresentationSidePreview ? 1 : 2}
              isAnimationActive={!isAnimationDisabled}
            />
        ))}
        {!isPresentationSidePreview && (
          <Tooltip content={<CustomTooltip inActionSheet={inActionSheet} colors={colors} />} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
