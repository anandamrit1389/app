import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Loader from '@/assets/loader.svg?react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'loading';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';
type ButtonType = 'button' | 'submit' | 'reset';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  id?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  classNames?: string;
  disabled?: boolean;
  loading?: boolean;
  isDark?: boolean;
  tooltip?: string;
  shortcut?: string;
  loader?: React.ReactNode;
  active?: boolean;
  tooltipClassNames?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return 'py-[5px] px-3 text-sm leading-4';
    case 'lg':
      return 'py-[17px] px-8 h-[48px]';
    case 'icon':
      return 'h-10 w-10 p-2';
    default:
      return 'py-3 px-6';
  }
};

const getDisabledState = (variant: ButtonVariant) => {
  switch (variant) {
    case 'default':
      return "after::content-[''] after::absolute after::inset-0 after::bg-white after::opacity-[0.55] after::rounded-lg cursor-not-allowed";
    case 'secondary':
      return 'border-[#00000010] text-[#374151] bg-[#F9FAFB] cursor-not-allowed';
  }
};

const getLoadingState = (variant: ButtonVariant) => {
  switch (variant) {
    case 'outline':
      return 'cursor-not-allowed disabled:opacity-100';
  }
};

const getDisabledDarkState = (variant: ButtonVariant) => {
  switch (variant) {
    case 'secondary':
      return 'border-[#00000010] text-[#374151] bg-[#F9FAFB] cursor-not-allowed';
  }
};

const getButtonVariant = (variant: ButtonVariant) => {
  switch (variant) {
    case 'default':
      return 'bg-default-gradient focus:bg-[#D93053] text-white bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%]';
    case 'secondary':
      return 'bg-white border-[1.5px] border-[#00000010] text-[#374151] rounded-lg hover:bg-lightGrey hover:border-[#171F3420] focus:bg-[#F3F4F6] focus:border-[#171F3420]';
    case 'outline':
      return 'bg-transparent rounded-lg border-[1.5px] border-lightGreyPress hover:border-[#D1D5DB] hover:bg-[#F8F9FA] text-darkText active:bg-lightGreyHover';
    case 'ghost':
      return 'hover:bg-[#F6F7F8] focus:bg-lightGreyHover';
    case 'destructive':
      return 'bg-[#B12525] border-[1.5px] rounded-lg hover:bg-[#961F1F] focus:bg-[#7C1A1A] focus:border-[#171F3420] text-white';
    case 'loading':
      return 'bg-default-gradient focus:bg-[#D93053] text-white bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_150%] rounded-full h-full text-white p-5';
  }
};

const getButtonColorsByTheme = (variant: ButtonVariant) => {
  switch (variant) {
    case 'secondary':
      return 'bg-[#111827] text-[#F8F9FA] focus:bg-[#111827] hover:bg-[#374151] active:bg-[#030712] disabled:bg-[#111827] disabled:text-[#F8F9FA]';
  }
};

const getButtonDefaultClasses = () => {
  return 'relative flex items-center gap-2 text-sm leading-[14px] h-auto transition-all duration-300 text-inter tracking-normal font-[500] font-family-inter focus-visible:ring-none focus-visible:ring-transparent';
};

const getLoaderStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'outline':
      return '[&_path]:stroke-darkText';
  }
};

const BaseButton = ({
  children,
  icon,
  onClick,
  tooltip,
  shortcut,
  loader,
  variant = 'default',
  size = 'default',
  type = 'button',
  classNames = '',
  disabled = false,
  loading = false,
  isDark = false,
  active = false,
  tooltipClassNames,
  ...props
}: IProps) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const buttonLoader = loader ?? (
    <Loader className={cn('animate-spin', getLoaderStyles(variant))} />
  );

  const button = (
    <Button
      type={type}
      variant={variant}
      className={cn(
        getButtonDefaultClasses(),
        getButtonSize(size),
        getButtonVariant(variant),
        isDark && getButtonColorsByTheme(variant),
        disabled && getDisabledState(variant),
        loading && getLoadingState(variant),
        (disabled || loading) && isDark && getDisabledDarkState(variant),
        active && 'bg-lightGreyHover font-bold',
        classNames,
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {shortcut ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {loading ? buttonLoader : icon ? icon : ''}
            {children && children}
          </div>
          <div className="text-[14px] font-normal text-grey">{shortcut}</div>
        </div>
      ) : (
        <>
          {loading ? <div className="">{buttonLoader}</div> : icon ? icon : ''}
          {children && !loading && children}
        </>
      )}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent className={cn('bg-[#1F2937] border-none shadow-lg', tooltipClassNames)}>
            <p className="text-3 text-white">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default BaseButton;
