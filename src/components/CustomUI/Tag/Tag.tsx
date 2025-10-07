import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  classNames?: string;
  onClick?: () => void;
}

const Tag = ({ children, classNames, onClick }: TagProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <span
      onClick={handleClick}
      className={cn(
        'bg-default-gradient text-white uppercase font-semibold font-inter text-xs p-2 rounded-lg',
        classNames,
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
