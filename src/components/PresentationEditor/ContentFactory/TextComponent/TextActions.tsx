import { 
  ChevronRight, 
  SlidersHorizontal, 
  GalleryHorizontal, 
  AlignCenterHorizontal, 
  AlignStartHorizontal, 
  AlignEndHorizontal 
} from 'lucide-react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import TextLonger from '@/assets/text-longer.svg?react';
import TextShorter from '@/assets/text-shorter.svg?react';
import MakeBulletPoints from '@/assets/bulletpoint-slide.svg?react';
import AskAI from '@/assets/ai-stars-2.svg?react';
import Tonality from '@/assets/writing-sign.svg?react';
import Funnier from '@/assets/funnier.svg?react';
import FirstPerson from '@/assets/first-person.svg?react';
import MoreFormal from '@/assets/more-formal.svg?react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface IProps {
  isOpen: boolean;
  onSelectVariant: (variant: string) => void;
  mobile?: boolean;
  isContentTooLong?: boolean;
  onFontSizeChange?: (fontSize: number) => void;
  contentId?: string;
  fontSize?: number;
  onHorizontalAlign?: (val: string) => void;
  isEmpty?: boolean;
}

const TextActions = ({ 
  isOpen, 
  onSelectVariant, 
  mobile, 
  isContentTooLong = false, 
  onFontSizeChange, 
  fontSize, 
  onHorizontalAlign,
  isEmpty = false
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [font, setFont] = useState(fontSize || 0.8);

  const handleFontSizeChange = (value: number[]) => {
    const newFontSize = value[0];
    setFont(newFontSize);
    onFontSizeChange && onFontSizeChange(newFontSize);
  };

  if (mobile) {
    return (
      <div className="w-full rounded-t-2xl bg-white shadow-lg">
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start"
          onClick={() => onSelectVariant('longer-text')}
          disabled={isEmpty}
        >
          <TextLonger /> {t('makeLonger')}
        </BaseButton>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start"
          onClick={() => onSelectVariant('shorter-text')}
          disabled={isEmpty}
        >
          <TextShorter /> {t('makeShorter')}
        </BaseButton>
        {isContentTooLong && (
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start"
            onClick={() => onSelectVariant('make-bullet-list')}
            disabled={isEmpty}
          >
            <MakeBulletPoints /> {t('makeBulletPoints')}
          </BaseButton>
        )}
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <BaseButton 
              variant="ghost" 
              classNames="text-darkGrey w-full flex justify-between"
              disabled={isEmpty}
            >
              <div className="flex w-full items-center justify-start gap-1">
                <Tonality />
                <span>{t('tonality')}</span>
              </div>
              <ChevronRight />
            </BaseButton>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetTitle className="hidden">Tonality options</SheetTitle>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => onSelectVariant('first-person')}
            >
              <FirstPerson /> {t('firstPerson')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => onSelectVariant('more-formal')}
            >
              <MoreFormal /> {t('moreFormal')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start"
              onClick={() => onSelectVariant('funnier')}
              disabled={isEmpty}
            >
              <Funnier /> {t('funnier')}
            </BaseButton>
          </SheetContent>
        </Sheet>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start"
          onClick={() => onSelectVariant('regenerate')}
        >
          <AskAI /> {t('regenerate')}
        </BaseButton>
        {onFontSizeChange && (
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <BaseButton variant="ghost" classNames="text-darkGrey w-full flex justify-between">
                <div className="flex w-full items-center justify-start gap-2">
                  <SlidersHorizontal />
                  <span>{t('changeFontSize')}</span>
                </div>
                <ChevronRight />
              </BaseButton>
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-2xl p-4">
              <SheetTitle className="mb-4 font-semibold">{t('changeFontSize')}</SheetTitle>
              <div className="flex items-center gap-3 text-darkText">
                <span className="text-sm font-bold select-none">A</span>
                <Slider
                  value={[font]}
                  max={4}
                  min={0.4}
                  step={0.1}
                  onValueChange={handleFontSizeChange}
                  className="flex-1"
                />
                <span className="text-xl font-bold select-none">A</span>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {onHorizontalAlign && (
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <BaseButton variant="ghost" classNames="text-darkGrey w-full flex justify-between">
                <div className="flex w-full items-center justify-start gap-2">
                  <GalleryHorizontal />
                  <span>{t('changeHorizontalAlign')}</span>
                </div>
                <ChevronRight />
              </BaseButton>
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-2xl p-0">
              <BaseButton
                variant="ghost"
                classNames="text-darkGrey w-full justify-start font-normal px-4 py-3"
                onClick={() => {
                  onHorizontalAlign('text-left');
                  onSelectVariant('free-slide');
                }}
              >
                <AlignStartHorizontal /> {t('left')}
              </BaseButton>
              <BaseButton
                variant="ghost"
                classNames="text-darkGrey w-full justify-start font-normal px-4 py-3"
                onClick={() => {
                  onHorizontalAlign('text-center');
                  onSelectVariant('free-slide');
                }}
              >
                <AlignCenterHorizontal /> {t('center')}
              </BaseButton>
              <BaseButton
                variant="ghost"
                classNames="text-darkGrey w-full justify-start font-normal px-4 py-3"
                onClick={() => {
                  onHorizontalAlign('text-right');
                  onSelectVariant('free-slide');
                }}
              >
                <AlignEndHorizontal /> {t('right')}
              </BaseButton>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  if (isOpen) {
    return (
      <div>
        <div className={`font-family-inter w-[200px] rounded-lg bg-white shadow-lg`}>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => onSelectVariant('longer-text')}
            disabled={isEmpty}
          >
            <TextLonger /> {t('makeLonger')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => onSelectVariant('shorter-text')}
            disabled={isEmpty}
          >
            <TextShorter /> {t('makeShorter')}
          </BaseButton>
          {isContentTooLong && (
            <BaseButton
              variant="ghost"
              classNames="text-darkGrey w-full justify-start font-normal p-3"
              onClick={() => onSelectVariant('make-bullet-list')}
              disabled={isEmpty}
            >
              <MakeBulletPoints /> {t('makeBulletPoints')}
            </BaseButton>
          )}
          <HoverCard >
            <HoverCardTrigger>
              <BaseButton
                variant="ghost"
                classNames="text-darkGrey w-full flex justify-between pe-2 font-normal p-3"
                disabled={isEmpty}
              >
                <div className="flex w-full items-center justify-start gap-1">
                  <Tonality />
                  <span>{t('tonality')}</span>
                </div>
                <ChevronRight />
              </BaseButton>
            </HoverCardTrigger>
            {!isEmpty && (
              <HoverCardContent side="right" className="p-0">
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => onSelectVariant('first-person')}
                >
                  <FirstPerson /> {t('firstPerson')}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => onSelectVariant('more-formal')}
                >
                  <MoreFormal /> {t('moreFormal')}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => onSelectVariant('funnier')}
                >
                  <Funnier /> {t('funnier')}
                </BaseButton>
              </HoverCardContent>
            )}
          </HoverCard>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => onSelectVariant('regenerate')}
          >
            <AskAI /> {t('regenerate')}
          </BaseButton>
          {/* {onFontSizeChange && (
            <HoverCard open={hoverOpen} onOpenChange={() => setHoverOpen(!hoverOpen)}>
              <HoverCardTrigger>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full flex justify-between pe-2 font-normal p-3"
                >
                  <div className="flex w-full items-center justify-start gap-1">
                    <SlidersHorizontal />
                    <span>{t('changeFontSize')}</span>
                  </div>
                  <ChevronRight />
                </BaseButton>
              </HoverCardTrigger>

              <HoverCardContent side="right" className="p-3 w-48">
                <div className="flex items-center gap-2 text-darkText">
                  <span className="text-sm font-bold">A</span>
                  <Slider
                    value={[font]}
                    max={4}
                    min={0.4}
                    step={0.1}
                    onValueChange={handleFontSizeChange}
                    className="flex-1 z-10"
                    onPointerUp={() => onSelectVariant('free-slide')}
                  />
                  <span className="text-xl font-bold">A</span>
                </div>
              </HoverCardContent>
            </HoverCard>
          )} */}
          {onHorizontalAlign && (
            <HoverCard>
              <HoverCardTrigger>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full flex justify-between pe-2 font-normal p-3"
                >
                  <div className="flex w-full items-center justify-start gap-1">
                    <GalleryHorizontal />
                    <span>{t("changeHorizontalAlign")}</span>
                  </div>
                  <ChevronRight />
                </BaseButton>
              </HoverCardTrigger>
              <HoverCardContent side="right" className="p-0">
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => {
                    onHorizontalAlign('text-left');
                    onSelectVariant('free-slide');
                  }}
                >
                  <AlignStartHorizontal /> {t('left')}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => { 
                    onHorizontalAlign('text-center');
                    onSelectVariant('free-slide');
                  }}
                >
                  <AlignCenterHorizontal /> {t('center')}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  classNames="text-darkGrey w-full justify-start font-normal p-3"
                  onClick={() => {
                    onHorizontalAlign('text-right');
                    onSelectVariant('free-slide');
                  }}
                >
                  <AlignEndHorizontal /> {t('right')}
                </BaseButton>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </div>
    );
  }
};

export default TextActions;
