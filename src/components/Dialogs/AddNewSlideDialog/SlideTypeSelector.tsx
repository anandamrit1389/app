import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import LayoutPanelTop from '@/assets/change-layout.svg?react';
import AIStarsGrey from '@/assets/ai-stars-2.svg?react';
import LongShortText from '@/assets/long-short-text-slide.svg?react';
import Image from '@/assets/image-slide.svg?react';
import ImageCaption from '@/assets/image-caption-slide.svg?react';
import Charts from '@/assets/charts-slide.svg?react';
import BulletPoints from '@/assets/bulletpoint-slide.svg?react';
import CoverSlide from '@/assets/cover-slide.svg?react';
import ImportantText from '@/assets/important-text-slide.svg?react';
import { Move } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Check, PlusIcon, Table } from 'lucide-react';
import { cn } from '@/lib/utils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';

interface IProps {
  selectedType: string;
  setSelectedType: (val: string) => void;
  mobile: boolean;
  hasReachedMaxSlides: boolean;
  setShowUpgradeModal: (val: boolean) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const SlideTypeSelector = ({
  selectedType,
  setSelectedType,
  mobile,
  hasReachedMaxSlides,
  setShowUpgradeModal,
  open,
  setOpen,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const { presentation } = useContext(PresentationContext);

  const isGenerating = !presentation?.generationFinished;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && hasReachedMaxSlides) {
      setShowUpgradeModal(true);
      return;
    }
    setOpen(isOpen);
  };

  if (mobile) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className="me-3 h-full w-fit rounded-full bg-white px-3 outline outline-1 outline-lightGreyPress">
          <LayoutPanelTop />
        </SheetTrigger>
        <SheetContent
          outsideclose="true"
          side="bottom"
          className={`align-start flex w-full flex-col justify-start overflow-auto rounded-t-2xl bg-white  pt-6`}
        >
          {variants?.map((variation) => (
            <BaseButton
              variant="ghost"
              classNames={cn('p-2 ps-3 pe-8 justify-between h-8', {
                'bg-[#F8F9FA]': variation.value === selectedType,
              })}
              key={variation.value}
              onClick={() => {
                setSelectedType(variation.value);
                setSheetOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                {variation.icon}
                {t(variation.labelKey)}
              </div>
              {variation.value === selectedType && <Check className="w-4 text-slushPink" />}
            </BaseButton>
          ))}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Select
      onValueChange={setSelectedType}
      value={selectedType}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger
        disabled={isGenerating}
        className="me-3 flex h-8 w-full items-center justify-center gap-1 rounded-lg px-4"
        hideChevron="true"
      >
        <PlusIcon className="size-4" /> {t('addSlide')}
      </SelectTrigger>
      <SelectContent side="top" position="popper">
        <div className="grid grid-cols-2 gap-2">
          {variants?.map((variation) => (
            <SelectItem
              className={cn('p-2 ps-3 pe-8', {
                'bg-[#F8F9FA]': selectedType === variation.value,
              })}
              key={variation.value}
              value={variation.value}
            >
              <div className="flex items-center gap-3">
                {variation.icon}
                {t(variation.labelKey)}
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};

export default SlideTypeSelector;

const variants = [
  { labelKey: 'askAi', value: 'ask-ai', icon: <AIStarsGrey /> },
  { labelKey: 'longText', value: 'long-text-slide', icon: <LongShortText /> },
  { labelKey: 'shortText', value: 'short-text-slide', icon: <LongShortText /> },
  { labelKey: 'charts', value: 'chart-slide', icon: <Charts /> },
  { labelKey: 'image', value: 'images-slide', icon: <Image /> },
  {
    labelKey: 'bulletList',
    value: 'bullet-points-slide',
    icon: <BulletPoints />,
  },
  {
    labelKey: '2xImageCaption',
    value: 'two-image-caption-slide',
    icon: <ImageCaption />,
  },
  {
    labelKey: '3xImageCaption',
    value: 'three-image-caption-slide',
    icon: <ImageCaption />,
  },
  {
    labelKey: 'coverSlide',
    value: 'section-headline-slide',
    icon: <CoverSlide />,
  },
  {
    labelKey: 'importantText',
    value: 'important-text-slide',
    icon: <ImportantText />,
  },
  {
    labelKey: 'simpleTable',
    value: 'table-slide',
    icon: <Table />,
  },
  {
    labelKey: 'freeSlide',
    value: 'free-slide',
    icon: <Move className="size-4" />,
  },
];
