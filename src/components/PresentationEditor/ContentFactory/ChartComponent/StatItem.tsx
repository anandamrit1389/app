import { formatYAxis } from '@/components/Charts/Components/utils';

interface StatItemProps {
  label: string;
  value: number;
  name: string;
  className?: string;
  textClassName?: string;
  valueClassName?: string;
  nameClassName?: string;
}

export const StatItem = ({
  label,
  value,
  name,
  className,
  textClassName,
  valueClassName,
  nameClassName,
}: StatItemProps) => (
  <div className={className}>
    <div className={textClassName}><p>{label}</p></div>
    <div className={valueClassName}><p>{formatYAxis(value)}</p></div>
    <div className={nameClassName}><p>{name}</p></div>
  </div>
);

export default StatItem;
