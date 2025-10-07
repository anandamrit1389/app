import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Loader from '@/assets/loader-color.svg?react';
import { Progress } from '@/components/ui/progress';
import ProCrown from '@/assets/pro-crown.svg?react';
import { useTranslation } from 'react-i18next';

interface ExportItemProps {
  loading: boolean;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isPro?: boolean;
  disabled: boolean;
  hasOptions?: boolean;
  options?: React.ReactNode;
}

const ExportItem = ({
  loading,
  title,
  icon,
  onClick,
  disabled,
  isPro,
  hasOptions = false,
  options,
}: ExportItemProps) => {
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  useEffect(() => {
    if (loading) {
      setProgress(5);

      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(timer);
            return 95;
          }
          const increment = 0.1;
          return Math.min(95, prevProgress + increment);
        });
      }, 16);

      return () => clearInterval(timer);
    } else if (progress > 0) {
      setProgress(100);
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 500);

      return () => clearTimeout(resetTimer);
    }
  }, [loading]);

  const handleMainClick = () => {
    if (hasOptions) {
      setShowOptions(!showOptions);
    } else {
      onClick();
    }
  };

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg">
      <Button
        className="relative flex h-auto w-full cursor-pointer items-center justify-between rounded-lg bg-lightGrey p-1 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress"
        onClick={handleMainClick}
        disabled={disabled || loading}
      >
        <div className="flex items-center justify-start gap-4 w-full">
          <div className="flex items-center justify-center size-10 shrink-0">{icon}</div>
          <div className="flex items-center justify-between w-full">
            <p className="font-semibold">{title}</p>
            <div>
              {isPro === false && (
                <div className="flex items-center gap-1 rounded-md bg-[#BD9E60] px-2 py-0.5">
                  <ProCrown className="size-3" />
                  <span className="text-xs text-white">{t('pro')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="me-1">
            <Loader className="animate-spin" />
          </div>
        ) : hasOptions ? (
          showOptions ? (
            <ChevronDown size="24" color="#374151" strokeWidth="1.5" />
          ) : (
            <ChevronRight size="24" color="#374151" strokeWidth="1.5" />
          )
        ) : (
          <ChevronRight size="24" color="#374151" strokeWidth="1.5" />
        )}
      </Button>

      {/* Options Section */}
      {hasOptions && showOptions && options && <div className="">{options}</div>}

      {/* Progress Bar */}
      {(loading || progress > 0) && (
        <div className="absolute bottom-0 left-0 z-10 w-full">
          <Progress
            value={progress}
            className="h-1 bg-transparent transition-all duration-300 ease-out"
          />
        </div>
      )}
    </div>
  );
};

export default ExportItem;
