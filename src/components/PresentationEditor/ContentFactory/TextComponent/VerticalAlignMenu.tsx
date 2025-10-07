import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { ChevronRight, AlignCenterVertical, AlignStartVertical, AlignEndVertical, GalleryVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  setAlignVertical: (id: string, value: string) => void;
  contentId: string;
  mobile?: boolean;
}

const VerticalAlignMenu = ({ setAlignVertical, contentId, mobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const options = [
    { label: 'top', value: 'justify-start', icon: <AlignStartVertical className="size-5" /> },
    { label: 'center', value: 'justify-center', icon: <AlignCenterVertical className="size-5" /> },
    { label: 'bottom', value: 'justify-end', icon: <AlignEndVertical className="size-5" /> },
  ];

  if (mobile) {
    return (
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full flex justify-between pe-2 font-normal pl-2 py-3"
          >
            <div className="flex w-full items-center justify-start gap-4 text-darkText">
              <div className="w-6 pl-2">
                <GalleryVertical className="size-5 text-darkText" />
              </div>
              <span>{t('changeVerticalAlign')}</span>
            </div>
            <ChevronRight />
          </BaseButton>
        </SheetTrigger>

        <SheetContent side="bottom" className="rounded-t-2xl bg-white">
          <SheetTitle className="mb-2 px-4">{t('changeVerticalAlign')}</SheetTitle>
          {options.map((option) => (
            <BaseButton
              key={option.value}
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => setAlignVertical(contentId, option.value)}
            >
              {option.icon}
              <span className="text-darkHeadline ml-2">{t(option.label)}</span>
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
            className="flex w-full items-center justify-start gap-4 text-darkText"
          >
            <div className="w-6 pl-2">
              <GalleryVertical className="size-5 text-darkText" />
            </div>
            <span>{t('changeVerticalAlign')}</span>
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
            onClick={() => setAlignVertical(contentId, option.value)}
          >
            {option.icon}
            <span className="text-darkHeadline ml-2">{t(option.label)}</span>
          </BaseButton>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};

export default VerticalAlignMenu;
