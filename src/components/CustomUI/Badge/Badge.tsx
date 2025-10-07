import { cn } from '@/lib/utils';

interface BadgeProps {
  children?: React.ReactNode;
  classNames?: string;
}

const Badge = ({ children, classNames, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'flex items-center justify-center absolute -right-2 -top-2 w-[17px] h-[17px] rounded-full bg-[#FF395C] text-white font-inter font-semibold text-[11px] border border-white font-inter',
        classNames,
      )}
      {...props}
    >
      {children && children}
    </span>
  );
};

export default Badge;
