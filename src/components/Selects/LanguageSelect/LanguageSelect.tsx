import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import languages from '@/i18n/languages';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DrawerSelect,
  DrawerSelectContent,
  DrawerSelectDescription,
  DrawerSelectItem,
  DrawerSelectTitle,
  DrawerSelectTrigger,
  DrawerSelectValue,
} from '@/components/ui/drawer-select';

interface LanguageSelectProps {
  icon?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  triggerClassName?: string;
  contentClassName?: string;
  isMobile?: boolean;
}

const LanguageSelect = ({
  icon,
  side,
  align,
  triggerClassName,
  contentClassName,
  isMobile = false,
}: LanguageSelectProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectFontsOpen, setSelectFontOpen] = useState(false);

  const changeLanguage = (lng: keyof typeof languages) => {
    const oldLang = i18n.language;

    setSelectFontOpen(false);
    i18n.changeLanguage(lng);
    localStorage.setItem('selectedLang', lng);

    navigate(`${location.pathname.replace(`/${oldLang}/`, `/${lng}/`)}`);
  };
  if (isMobile) {
    return (
      <DrawerSelect open={selectFontsOpen} onOpenChange={(isOpen) => setSelectFontOpen(isOpen)}>
        <DrawerSelectTrigger asChild>
          <div
            onClick={() => setSelectFontOpen(true)}
            className="flex items-center gap-2 text-[14px]"
          >
            {icon ? (
              <>
                {icon} <div className="capitalize">{i18n.language}</div>
              </>
            ) : (
              <DrawerSelectValue
                className={cn(
                  'rounded-lg flex items-center gap-[5px] w-max focus-visible:ring-transparent focus:ring-transparent active:ring-transparent',
                  triggerClassName,
                )}
              >
                <div>{languages[i18n.language as keyof typeof languages].nativeName}</div>
              </DrawerSelectValue>
            )}
          </div>
        </DrawerSelectTrigger>
        <DrawerSelectContent className="flex w-full flex-col gap-0 px-4 pb-4 pt-2 transition-all">
          <DrawerSelectTitle />
          <DrawerSelectDescription />
          {Object.keys(languages).map((lng) => (
            <DrawerSelectItem
              key={lng}
              isSelected={i18n.language === lng}
              onClick={() => changeLanguage(lng as keyof typeof languages)}
              className="font-sm data-[disabled]:opacity-1 mb-2 p-2 leading-[16px] text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink"
            >
              {languages[lng as keyof typeof languages].nativeName}
            </DrawerSelectItem>
          ))}
        </DrawerSelectContent>
      </DrawerSelect>
    );
  }
  return (
    <Select onValueChange={changeLanguage} defaultValue="en" value={i18n.language}>
      <SelectTrigger
        className={cn(
          'rounded-lg flex items-center gap-2 w-max focus-visible:ring-transparent focus:ring-transparent active:ring-transparent',
          triggerClassName,
        )}
      >
        {icon ? (
          <>
            {icon} <div className="capitalize">{i18n.language}</div>
          </>
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent
        className={cn('w-[200px] p-0 [&>div]:p-0', contentClassName)}
        side={side}
        align={align}
      >
        <SelectGroup className="p-2">
          {Object.keys(languages).map((lng) => (
            <SelectItem
              key={lng}
              disabled={i18n.language === lng}
              value={lng}
              className="font-sm data-[disabled]:opacity-1 mb-2 p-2 leading-[16px] text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink"
            >
              {languages[lng as keyof typeof languages].nativeName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
