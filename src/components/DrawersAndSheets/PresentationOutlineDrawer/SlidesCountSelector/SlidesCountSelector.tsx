import ChevronDown from '@/assets/chevron-down.svg?react';
import SlideIcon from '@/assets/stacked.svg?react';
import ProCrownIcon from '@/assets/pro-crown.svg?react';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  FREE_PLAN_SLIDES_COUNT,
  PRO_PLAN_SLIDES_COUNT,
} from '@/helpers/constants/subscription.const';
import { AuthContext } from '@/providers/auth.provider';
import { cn } from '@/lib/utils';

interface SlidesCountSelectorProps {
  mobile?: boolean;
  onTogglePricingPlansModal: () => void;
  updateSlidesCount: (count: number) => void;
  selectedSlidesCount: number;
  triggerClassName?: string;
}

const SlidesCountSelector = ({
  mobile,
  onTogglePricingPlansModal,
  selectedSlidesCount,
  updateSlidesCount,
  triggerClassName,
}: SlidesCountSelectorProps) => {
  const [showSelector, setShowSelector] = useState(false);

  const { hasActiveSubscription } = useContext(AuthContext);

  const slidesCount = hasActiveSubscription ? PRO_PLAN_SLIDES_COUNT : FREE_PLAN_SLIDES_COUNT - 1;

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const handleTogglePricingPlansModal = () => {
    onTogglePricingPlansModal();
    setShowSelector(false);
    document.body.style.pointerEvents = '';
  };

  const filteredSlidesCount = hasActiveSubscription
    ? [...Array(9).keys()].map((i) => i + 2).concat([15, 20, 25, 30])
    : Array.from({ length: slidesCount }, (_, i) => i + 2);

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          className={cn(
            'flex h-auto w-[calc(50%-6px)] justify-between gap-3 rounded-lg bg-lightGreyHover px-5 py-2 font-semibold',
            triggerClassName,
          )}
          onClick={() => setShowSelector(!showSelector)}
        >
          <div className="flex items-center gap-3">
            <SlideIcon />
            <p className="text-start">{t('slidesCount', { count: selectedSlidesCount })}</p>
          </div>
          <ChevronDown className="ml-auto" />
        </Button>

        <Sheet
          modal={false}
          open={showSelector}
          onOpenChange={() => setShowSelector(!showSelector)}
        >
          <SheetContent
            outsideclose="true"
            side="bottom"
            className="flex h-3/4 w-full flex-col justify-start overflow-auto rounded-t-3xl bg-white"
          >
            <SheetTitle className="hidden">{t('imagePreferenceSelector')}</SheetTitle>

            <RadioGroup
              value={selectedSlidesCount.toString()}
              onValueChange={(count) => {
                updateSlidesCount(Number(count));
                setShowSelector(false);
              }}
            >
              {filteredSlidesCount.map((count) => (
                <div className="mb-3 flex items-center gap-3" key={count.toString()}>
                  <RadioGroupItem className="hover:bg-lightGrey" value={count.toString()} />
                  <Label>{count}</Label>
                </div>
              ))}
            </RadioGroup>
            {!hasActiveSubscription && (
              <div
                className="mb-3 flex w-full cursor-pointer items-center justify-between rounded border border-[#BD9E6020] bg-[#FAF0E0] p-3 py-2 font-semibold text-darkText"
                onClick={handleTogglePricingPlansModal}
              >
                {t('needMoreSlides')}
                <BaseButton
                  icon={<ProCrownIcon />}
                  size="sm"
                  classNames="bg-[#BD9E60] hover:bg-[#AB8D51] focus:bg-[#997D46] gap-1 py-0.5 px-1.5 text-sm leading-3"
                >
                  {t('pro')}
                </BaseButton>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'flex w-[224px] items-center justify-between rounded-lg border-none bg-lightGreyHover px-3 py-2 text-[14px] font-normal capitalize transition-all hover:bg-lightGreyPress',
              triggerClassName,
            )}
          >
            <div className="flex items-center gap-1">
              <SlideIcon />
              {t('slidesCount', { count: selectedSlidesCount })}
            </div>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[300px] w-56 overflow-auto p-2">
          <DropdownMenuRadioGroup
            value={selectedSlidesCount.toString()}
            onValueChange={(count) => updateSlidesCount(Number(count))}
            className="mb-3 flex flex-col"
          >
            {filteredSlidesCount.map((count) => (
              <DropdownMenuRadioItem
                key={count}
                className="hover:bg-lightGrey"
                value={count.toString()}
              >
                {t('slidesCount', { count })}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          {!hasActiveSubscription && (
            <div
              className="mb-3 flex w-full cursor-pointer items-center justify-between rounded bg-[#FAF0E0] p-3 font-semibold text-darkText"
              onClick={handleTogglePricingPlansModal}
            >
              {t('slidesCount', { count: PRO_PLAN_SLIDES_COUNT })}
              <BaseButton
                icon={<ProCrownIcon />}
                size="sm"
                classNames="bg-[#BD9E60] hover:bg-[#AB8D51] focus:bg-[#997D46] gap-1 py-0.5 px-1.5 text-xs leading-3"
              >
                {t('pro')}
              </BaseButton>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SlidesCountSelector;
