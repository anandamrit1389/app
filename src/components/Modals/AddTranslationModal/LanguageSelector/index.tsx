/* eslint-disable no-constant-condition */
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Language } from '@/helpers/constants/languages.const';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Lang from '@/assets/message-language.svg?react';

interface LanguageSelectProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  triggerClassName?: string;
  isMobile?: boolean;
  selectedLanguage: string;
  onChange: (lang: string) => void;
  languages: Language[];
  disabled: boolean;
}

const LanguageSelect = ({
  side,
  align,
  triggerClassName,
  selectedLanguage,
  languages,
  onChange,
  disabled,
}: LanguageSelectProps) => {
  const [selectFontsOpen, setSelectFontOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    onChange(lng);
    setSelectFontOpen(false);
  };

  if (false) {
    // TODO: temp disable need to fix select scroll on modal
    return (
      <>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'flex h-auto gap-3 rounded-lg px-5 py-2 font-semibold justify-between w-full',
            triggerClassName,
          )}
          onClick={() => setSelectFontOpen(!selectFontsOpen)}
        >
          <div className="flex items-center gap-3 text-darkText">
            <p className="text-start">
              {languages?.find((l) => l.value === selectedLanguage)?.label || (
                <div className="flex items-center gap-1">
                  <Lang />
                  Select Language
                </div>
              )}
            </p>
          </div>
          <ChevronDown />
        </Button>

        <Sheet
          modal={false}
          open={selectFontsOpen}
          onOpenChange={() => setSelectFontOpen(!selectFontsOpen)}
        >
          <SheetContent
            outsideclose="true"
            side="bottom"
            className="flex h-3/4 w-full flex-col justify-start overflow-auto rounded-t-3xl bg-white"
          >
            <SheetTitle className="hidden"></SheetTitle>

            <RadioGroup value={selectedLanguage} onValueChange={changeLanguage}>
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
    <Select
      onValueChange={changeLanguage}
      defaultValue="en"
      value={selectedLanguage}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'rounded-lg flex items-center gap-2 focus-visible:ring-transparent focus:ring-transparent active:ring-transparent w-full',
          triggerClassName,
        )}
      >
        <SelectValue
          placeholder={
            <div className="flex items-center gap-1">
              <Lang />
              Select Language
            </div>
          }
        />
      </SelectTrigger>
      <SelectContent className={'w-full'} side={side} align={align}>
        {languages.map((lng) => (
          <SelectItem
            key={lng.value}
            disabled={selectedLanguage === lng.value}
            value={lng.value}
            className="mb-2 p-2 leading-[16px] text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover data-[disabled]:bg-lightGrey"
          >
            {lng.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
