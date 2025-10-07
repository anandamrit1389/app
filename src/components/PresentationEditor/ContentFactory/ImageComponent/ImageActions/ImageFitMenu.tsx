import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { ImageFit } from '@/interfaces/ISlides';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shrink, ChevronRight, Minimize, Maximize, Fullscreen } from 'lucide-react';

interface IProps {
  imageFit: ImageFit;
  setImageFit: (val: ImageFit) => void;
  mobile?: boolean;
}

const ImageFitMenu = ({ imageFit, setImageFit, mobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const imageFitOptions = [
    { label: 'cover', icon: <Fullscreen className="size-4" /> },
    { label: 'fill', icon: <Maximize className="size-4" /> },
    { label: 'contain', icon: <Minimize className="size-4" /> },
  ];

  const handleOptionClick = (option: ImageFit) => {
    setImageFit(option);
  };

  if (mobile) {
    return (
      <div
        className={`rounded-lg p-2 text-sm font-medium hover:bg-[#F6F7F8] ${dropdownOpen && 'bg-[#F6F7F8]'}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="my-1 ml-4 flex items-center gap-2">
          <div className="w-6 pl-[2px]">
            <Shrink className="size-4 text-darkText" />
          </div>
          {t('changeImageFit')}
        </div>

        {dropdownOpen && (
          <div className="absolute bottom-1 left-0 w-full rounded-2xl bg-white ">
            {imageFitOptions.map((option) => (
              <div
                key={option.label}
                onClick={() => handleOptionClick(option.label as ImageFit)}
                className="p-3 hover:bg-[#F6F7F8] rounded-2xl"
              >
                <div className="flex flex-row items-center">
                  {option.label === imageFit ? (
                    <div className="flex items-center gap-2">
                      <span>{t(option.label)}</span>
                      <span className="bg-[#E8E8E8] p-1 text-[10px] font-medium leading-none">
                        {t('used')}
                      </span>
                    </div>
                  ) : (
                    <span>{t(option.label)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full flex justify-between pe-2 font-normal pl-1 py-2"
        >
          <div className="flex w-full items-center justify-start gap-2 text-darkHeadline">
            <div className="w-6 pl-1">
              <Shrink className="size-5 text-darkText" />
            </div>
            <span>{t('changeImageFit')}</span>
          </div>
          <ChevronRight />
        </BaseButton>
      </HoverCardTrigger>

      <HoverCardContent side="right" className="p-0 bg-white">
        {imageFitOptions.map((option) => (
          <BaseButton
            key={option.label}
            variant="ghost"
            classNames="text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => handleOptionClick(option.label as ImageFit)}
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <span className="text-darkHeadline">{t(option.label)}</span>
              {option.label === imageFit && (
                <span className="bg-[#E8E8E8] p-1 text-[10px] font-medium leading-none">
                  {t('used')}
                </span>
              )}
            </div>
          </BaseButton>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ImageFitMenu;
