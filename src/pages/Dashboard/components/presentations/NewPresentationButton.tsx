import AIStar from '@/assets/ai-stars-1.svg?react';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface NewPresentationButtonProps {
  asMenuItem: boolean;
  mobile?: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
  to?: string;
  onClick?: () => void;
}

export const NewPresentationButton = ({
  asMenuItem = false,
  mobile,
  icon,
  title,
  description,
  className,
  to,
  onClick,
}: NewPresentationButtonProps) => {
  const content = mobile ? (
    <div className={`flex h-full flex-col items-center gap-2 ${to && 'pt-1'}`}>
      <div className="relative size-8">
        {icon}
        <div className="absolute -right-4 -top-2">
          <AIStar className="size-4" />
        </div>
      </div>
      <h3 className="text-center text-[12px] font-semibold text-darkRed capitalize">{title}</h3>
    </div>
  ) : (
    <>
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div className="text-left">
          <h3
            className={cn('whitespace-nowrap text-[16px] font-semibold text-darkRed capitalize', {
              'text-[14px] text-darkText font-normal': asMenuItem,
            })}
          >
            {title}
          </h3>
          {!asMenuItem && <p className="text-[14px] text-buccaneer">{description}</p>}
        </div>
      </div>

      {!asMenuItem && (
        <div className="flex h-full items-center justify-end">
          <AIStar className="size-4" />
        </div>
      )}
    </>
  );
  const commonClassName = mobile
    ? cn(
        'relative flex flex-1 h-26 cursor-pointer items-center justify-center rounded-lg bg-secondaryBg px-1 py-3 outline outline-2 outline-[#FEEDED] transition-all hover:outline-[#EDDCDC] whitespace-normal',
        className,
      )
    : cn(
        'relative flex min-w-[264px] h-18 cursor-pointer items-start justify-between gap-3 rounded-lg bg-secondaryBg p-3 outline outline-2 outline-[#FFE7E7] transition-all hover:bg-[#FFF0F0]',
        className,
      );

  if (to) {
    return (
      <LocaleLink to={to} className={`${commonClassName} pt-2`}>
        {content}
      </LocaleLink>
    );
  }

  return (
    <Button onClick={onClick} className={commonClassName}>
      {content}
    </Button>
  );
};
