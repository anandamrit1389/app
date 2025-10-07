import { ReactNode } from 'react';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  active?: boolean;
  children: ReactNode;
  to: string;
}

const NavigationLink = ({ active, children, to }: NavigationLinkProps) => {
  const linkClasses = cn(
    'flex',
    'items-center',
    'gap-3',
    'rounded-lg',
    'px-3',
    'py-2',
    'text-[14px]',
    'font-medium',
    'text-tertiaryText',
    {
      'bg-lightGrey text-slushPink': active,
      'hover:bg-lightGrey': !active,
    },
  );

  return (
    <LocaleLink to={to} className={linkClasses}>
      {children}
    </LocaleLink>
  );
};

export default NavigationLink;
