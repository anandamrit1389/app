import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { ChevronRight, Square, Squircle, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SquareRoundCorner from '@/assets/square-round-corner.svg?react';

interface IProps {
  setBorderRadius: (id: string, value: string) => void;
  contentId: string;
  type?: string;
  mobile?: boolean;
}

const BorderRadiusSelector = ({ setBorderRadius, contentId, type, mobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const options = [
    { label: 'none', value: '0px', icon: <Square className="size-5" /> },
    { label: 'slightly', value: '25px', icon: <Squircle className="size-5" /> },
    { label: 'full', value: '500px', icon: <Circle className="size-5" /> },
  ];

  if (mobile) {
    return (
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <BaseButton
            variant="ghost"
            classNames={`text-darkGrey w-full flex justify-between pe-2 font-normal pl-2 py-3`}
          >
            <div
              className={`flex w-full items-center justify-start ${
                type === 'text' ? 'gap-4 text-darkText' : 'gap-2 text-darkHeadline'
              }`}
            >
              <div className={`w-6 ${type === 'text' ? 'pl-2' : 'pl-1'}`}>
                <SquareRoundCorner className="size-5 text-darkText" />
              </div>
              <span>{t('changeBorderRadius')}</span>
            </div>
            <ChevronRight />
          </BaseButton>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl p-4 bg-white">
          <SheetTitle className="mb-4 font-semibold">{t('changeBorderRadius')}</SheetTitle>
          {options.map((option) => (
            <BaseButton
              key={option.value}
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => setBorderRadius(contentId, option.value)}
            >
              {option.icon}
              <span className="text-darkHeadline">{t(option.label)}</span>
            </BaseButton>
          ))}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full flex justify-between pe-2 font-normal pl-1 py-2"
        >
          <div
            className={`flex w-full items-center justify-start ${type === 'text' ? 'gap-4 text-darkText' : 'gap-2 text-darkHeadline'}`}
          >
            <div className={`w-6 ${type === 'text' ? 'pl-2' : 'pl-1'}`}>
              <SquareRoundCorner className="size-5 text-darkText" />
            </div>
            <span>{t('changeBorderRadius')}</span>
          </div>
          <ChevronRight />
        </BaseButton>
      </HoverCardTrigger>

      <HoverCardContent side="right" className="p-0 bg-white">
        {options.map((option) => (
          <BaseButton
            key={option.value}
            variant="ghost"
            classNames="text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => setBorderRadius(contentId, option.value)}
          >
            {option.icon}
            <span className="text-darkHeadline">{t(option.label)}</span>
          </BaseButton>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};

export default BorderRadiusSelector;
