import StatItem from './StatItem';

interface StatSectionProps {
  stats: {
    highest: { value: number; name: string };
    lowest: { value: number; name: string };
  };
  color: string;
  variation: {
    statsClassName?: string;
    statsTextClassName?: string;
    statsValueClassName?: string;
    statsNameClassName?: string;
    statsSectionClassName?: string;
  };
  title?: string;
}

const StatSection = ({ stats, color, variation, title }: StatSectionProps) => (
  <div>
    { title && (
      <div className="flex items-center gap-1">
        <div className={`size-bulletPoint rounded-full`} style={{ backgroundColor: color }} />
        <div className={variation?.statsTextClassName}>{title}</div>
      </div>
    )}
    <div className={title ? 'grid grid-cols-2' : variation?.statsSectionClassName}>
      <StatItem
        label="Highest"
        value={stats.highest.value}
        name={stats.highest.name}
        className={variation?.statsClassName}
        textClassName={variation?.statsTextClassName}
        valueClassName={variation?.statsValueClassName}
        nameClassName={variation?.statsNameClassName}
      />
      <StatItem
        label="Lowest"
        value={stats.lowest.value}
        name={stats.lowest.name}
        className={variation?.statsClassName}
        textClassName={variation?.statsTextClassName}
        valueClassName={variation?.statsValueClassName}
        nameClassName={variation?.statsNameClassName}
      />
    </div>
  </div>
);

export default StatSection;
