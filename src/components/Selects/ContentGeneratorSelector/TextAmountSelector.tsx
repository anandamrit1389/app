import ChevronDown from '@/assets/chevron-down.svg?react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import TextAmount from '@/assets/text-amount.svg?react';
import { cn } from '@/lib/utils';

interface TextAmountSelector {
  mobile?: boolean;
  textAmount: string;
  setTextAmount: (textAmount: string) => void;
  triggerClassName?: string;
}

const TextAmountSelector = ({
  mobile,
  textAmount,
  setTextAmount,
  triggerClassName,
}: TextAmountSelector) => {
  const [showSelector, setShowSelector] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          className={cn(
            'flex h-auto w-full justify-between gap-3 rounded-lg bg-lightGreyHover px-5 py-2 font-semibold',
            triggerClassName,
          )}
          onClick={() => setShowSelector(!showSelector)}
        >
          <div className="flex items-center gap-3">
            <TextAmount />
            <p className="text-start capitalize">{textAmount}</p>
          </div>
          <ChevronDown className="ml-auto" />
        </Button>

        <Sheet
          modal={false}
          open={showSelector}
          onOpenChange={() => setShowSelector(!showSelector)}
        >
          <SheetContent
            hideclose="true"
            side="bottom"
            className="flex w-full flex-col justify-start rounded-t-3xl bg-white py-10"
          >
            <SheetTitle className="hidden">{t('textAmountSelector')}</SheetTitle>
            <RadioGroup
              value={textAmount}
              onValueChange={(value) => {
                setTextAmount(value);
                setShowSelector(false);
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <RadioGroupItem className="hover:bg-lightGrey" value="inspirational" />
                <Label>
                  <div>
                    <p className="mb-1">{t('inspirational')}</p>
                    <p className="font-normal text-tertiaryText">{t('inspirationalDescription')}</p>
                  </div>
                </Label>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <RadioGroupItem className="hover:bg-lightGrey" value="keynote" />
                <Label>
                  <div>
                    <p className="mb-1">{t('keynote')}</p>
                    <p className="font-normal text-tertiaryText">{t('keynote')}</p>
                  </div>
                </Label>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <RadioGroupItem className="hover:bg-lightGrey" value="business" />
                <Label>
                  <div>
                    <p className="mb-1">{t('business')}</p>
                    <p className="font-normal text-tertiaryText">{t('businessDescription')}</p>
                  </div>
                </Label>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <RadioGroupItem className="hover:bg-lightGrey" value="academic" />
                <Label>
                  <div>
                    <p className="mb-1">{t('academic')}</p>
                    <p className="font-normal text-tertiaryText">{t('academicDescription')}</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex w-[224px] items-center justify-between rounded-lg border-none bg-lightGreyHover px-3 py-2 text-[14px] font-normal capitalize transition-all hover:bg-lightGreyPress focus:outline-0',
            triggerClassName,
          )}
        >
          <div className="flex items-center gap-1">
            <TextAmount />
            {t(textAmount)}
          </div>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-2">
        <DropdownMenuRadioGroup
          value={textAmount}
          onValueChange={setTextAmount}
          className="flex flex-col gap-1"
        >
          <DropdownMenuRadioItem className="hover:bg-lightGrey" value="inspirational">
            <div>
              <p className="mb-1">{t('inspirational')}</p>
              <p className="font-normal text-tertiaryText">{t('inspirationalDescription')}</p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="hover:bg-lightGrey" value="keynote">
            <div>
              <p className="mb-1">{t('keynote')}</p>
              <p className="font-normal text-tertiaryText">{t('keynoteDescription')}</p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="hover:bg-lightGrey" value="business">
            <div>
              <p className="mb-1">{t('business')}</p>
              <p className="font-normal text-tertiaryText">{t('businessDescription')}</p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="hover:bg-lightGrey" value="academic">
            <div>
              <p className="mb-1">{t('academic')}</p>
              <p className="font-normal text-tertiaryText">{t('academicDescription')}</p>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TextAmountSelector;
