import useValidContext from '@/hooks/useValidContext';
import { ReactNode } from 'react';

interface TemplatePreviewProps {
  isMobile: boolean;
  theme: string;
  font: string;
  children: ReactNode;
  className?: string;
  slideType?: string;
}

const TemplatePreview = ({
  isMobile,
  theme,
  font,
  children,
  className = '',
  slideType,
}: TemplatePreviewProps) => {
  const { template } = useValidContext();
  const templateSelector = template ? 'template-selector-preview' : 'template-selector';
  const containerClasses = [
    'aspect-video',
    'bg-pageBg',
    'h-full',
    'w-full',
    isMobile ? 'mobile-template-selector' : templateSelector,
    'rounded',
    'outline',
    'outline-1',
    'outline-[#00000014]',
    `theme-${theme}`,
    `font-family-${font}`,
    `type-${slideType}`,
    className,
  ].join(' ');

  const contentClasses = [
    'relative',
    'isolate',
    'size-full',
    'overflow-hidden',
    'rounded',
    'bg-pageBg',
  ].join(' ');

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

export default TemplatePreview;
