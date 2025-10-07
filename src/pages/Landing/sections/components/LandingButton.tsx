import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { cn } from '@/lib/utils';

interface IProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const LandingButton = ({ children, className, onClick }: IProps) => {
  return (
    <BaseButton
      onClick={onClick}
      classNames={cn(
        'uppercase bg-[#111827] focus:bg-[#000000] hover:bg-[#374151] h-[40px] tablet:h-[48px]',
        className,
      )}
    >
      {children}
    </BaseButton>
  );
};

export default LandingButton;
