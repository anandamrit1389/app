import ChevronDown from '@/assets/chevron-down.svg?react';
import Lang from '@/assets/lang.svg?react';
import { languages } from '@/helpers/constants/languages.const';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  lang: string;
  onChange: (value: string) => void;
  mobile?: boolean;
  triggerClassName?: string;
}

const LanguageSelector = ({
  mobile,
  onChange,
  triggerClassName,
  lang = 'english',
}: LanguageSelectorProps) => {
  const [showSelector, setShowSelector] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });
  const language = languages?.find((l) => l.value === lang)?.label;

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          className={cn(
            'flex h-auto w-[calc(50%-6px)] gap-3 rounded-lg bg-lightGreyHover px-5 py-2 font-semibold justify-between',
            triggerClassName,
          )}
          onClick={() => setShowSelector(!showSelector)}
        >
          <div className="flex items-center gap-3">
            <Lang />
            <p className="text-start">{language}</p>
          </div>
          <ChevronDown />
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
              value={lang}
              onValueChange={(value) => {
                onChange(value);
                setShowSelector(false);
              }}
            >
              {languages?.map((lang) => (
                <div className="mb-3 flex items-center gap-3" key={lang.value}>
                  <RadioGroupItem className="hover:bg-lightGrey" value={lang.value} />
                  <Label>{lang.label}</Label>
                </div>
              ))}
            </RadioGroup>
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
              'flex w-[224px] items-center justify-between rounded-lg border-lightGreyHover bg-lightGreyHover px-3 py-2 text-[14px] font-normal capitalize transition-all hover:bg-lightGreyPress',
              triggerClassName,
            )}
          >
            <div className="flex items-end gap-1">
              <Lang />
              {language}
            </div>
            <ChevronDown className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-[300px] w-56 overflow-auto p-2" isInsideDialog={true}>
          <DropdownMenuRadioGroup
            value={lang}
            onValueChange={onChange}
            className="flex flex-col gap-1"
          >
            {languages?.map((lang) => (
              <DropdownMenuRadioItem
                className="hover:bg-lightGrey"
                value={lang.value}
                key={lang.value}
              >
                {lang.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
