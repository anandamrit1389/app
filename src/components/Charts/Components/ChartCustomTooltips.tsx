import { formatYAxis } from './utils';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    value2?: number;
    fill?: string;
    payload?: { originalName?: string; name: string };
  }>;
  name?: string;
  inActionSheet?: boolean;
  colors?: string[];
}

const CustomTooltip = ({ active, payload, inActionSheet = false, colors }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${inActionSheet ? 'bg-white' : 'bg-pageBg'} rounded-lg border border-gray-200 p-2 text-normalText text-bodyMedium`}
      >
        {payload.map((entry, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <div className="flex items-center gap-2">
              <div
                className={`size-2 rounded-full`}
                style={{ backgroundColor: colors ? colors[index] : 'red' }}
              ></div>
              <p className="text-sm font-medium">
                {entry.payload?.originalName || entry.payload?.name}
              </p>
            </div>
            <p className="text-sm pl-4">Value: {formatYAxis(entry.value)}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
