interface LegendProps {
  payload?: Array<{
    value: string;
    payload: { name: string; value: number; fill: string };
  }>;
}

const RenderLegend = ({ payload }: LegendProps) => {
  if (payload) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[1px] w-full bg-gray-200">
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between bg-[#F3F4F9] px-3 py-2 min-w-0"
          >
            <div className="flex items-center gap-content min-w-0">
              <div
                style={{ backgroundColor: entry.payload.fill }}
                className="size-2 shrink-0 rounded-full"
              />
              <span className="text-[#1F2937] text-bulletPointText truncate">
                {entry.payload.name}
              </span>
            </div>
            <span className="text-[#1F2937] text-bulletPointText font-medium whitespace-nowrap ml-2">
              {entry.payload.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default RenderLegend;
