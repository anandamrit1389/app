import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import learnMoreImg1 from '@/assets/learn-more1.png';
import learnMoreImg2 from '@/assets/learn-more2.png';

export interface ContentItem {
  titleKey: string;
  descriptionKey: string;
}

const contentKeys: ContentItem[] = Array.from({ length: 3 }, (_, index) => ({
  titleKey: `itemTitle${index + 1}`,
  descriptionKey: `itemDescription${index + 1}`,
}));

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

const BussinesLearnMoreModal = ({ open, onOpenChange }: IProps) => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'learnModeModal' });

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full flex-col gap-0 overflow-auto px-4 pb-4 pt-0 transition-all"
        >
          <div className="flex items-center justify-between py-[7px]">
            <BaseButton variant="ghost" onClick={onOpenChange} classNames="px-0 h-[56px]">
              <ArrowBack />
            </BaseButton>
            <SheetHeader className="">
              <SheetTitle>{t('title')}</SheetTitle>
            </SheetHeader>

            <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={onOpenChange}>
              <ArrowBack />
            </BaseButton>
          </div>
          <div className="flex h-full flex-col">
            {contentKeys.map((item) => (
              <div key={item.titleKey} className="mb-6">
                <h3 className="text-lg font-bold">{t(item.titleKey)}</h3>
                <p className="text-base text-gray-700">{t(item.descriptionKey)}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <img src={learnMoreImg1} alt="bg" />
            </div>
            <div>
              <img src={learnMoreImg2} alt="bg" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] max-w-[745px] flex-col gap-0 overflow-y-auto p-8 pt-10">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[24px] font-bold">{t('title')}</DialogTitle>
          <DialogDescription className="p-0" />
        </DialogHeader>

        <div className="flex flex-col  justify-center">
          {contentKeys.map((item) => (
            <div key={item.titleKey} className="mb-6">
              <h3 className="mb-2 text-lg font-bold">{t(item.titleKey)}</h3>
              <p className="text-base text-gray-700">{t(item.descriptionKey)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-6">
          <div>
            <img src={learnMoreImg1} alt="bg" />
          </div>
          <div>
            <img src={learnMoreImg2} alt="bg" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BussinesLearnMoreModal;
