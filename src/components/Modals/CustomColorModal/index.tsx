import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Ellipse from '@/assets/ellipse.svg?react';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

import { ThemeColors } from '@/interfaces/companies';

import ColorPickerCircle from './ColorPickerCircle';
import useMobile from '@/hooks/useMobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';

const initThemeColor: ThemeColors = {
  backgroundColor: '#fff',
  headlineColor: '#494952',
  textColor: '#D6D6D6',
  accentColor: '#F94A3A',
};

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  onAction: (colors: ThemeColors) => void;
  themeColors: ThemeColors | null;
}

const CustomColorModal = ({ open, onOpenChange, onAction, themeColors }: IProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'customColorModal',
  });
  const isMobile = useMobile();

  const [colors, setColors] = useState<ThemeColors>(initThemeColor);

  const handleChangeColor = (newColor: string, key: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: newColor,
    }));
  };

  const handleApply = () => {
    onAction(colors);
    onOpenChange();
  };

  useEffect(() => {
    if (themeColors && themeColors.backgroundColor != null) {
      setColors(themeColors);
    }
  }, [themeColors]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full flex-col gap-0 overflow-auto p-0 px-4 pb-4 transition-all"
        >
          <div className="flex items-center justify-between px-4 py-[7px]">
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

          <div className="flex items-center justify-center bg-lightGrey px-4 py-8">
            <div
              style={{ backgroundColor: colors.backgroundColor }}
              className="flex w-64 flex-col gap-2 rounded-lg p-6 shadow-menus"
            >
              <div
                style={{ backgroundColor: colors.headlineColor }}
                className="h-3 w-2/3 rounded-lg bg-black"
              ></div>
              <div
                style={{ backgroundColor: colors.textColor }}
                className="h-2 w-full rounded-lg bg-gray-500"
              ></div>
              <div className="h-2 w-10/12 rounded-lg bg-gray-500"></div>
              <Ellipse fill={colors.accentColor} />
            </div>
          </div>

          <div className="mb-6 mt-4 flex flex-col items-start px-4">
            <p>{t('description')}</p>
          </div>

          <div className="mb-10 px-4">
            {Object.entries(colors).map(([key, color]) => {
              return (
                <div key={key} className="mb-2 flex flex-row items-center justify-start gap-2">
                  <ColorPickerCircle
                    currentColor={color}
                    onColorChange={(newColor) => handleChangeColor(newColor, key)}
                  />
                  <div>
                    <p>{t(key)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex justify-between gap-2 px-4">
            <BaseButton variant="outline" classNames="px-9 w-full" onClick={onOpenChange}>
              {t('cancelBtn')}
            </BaseButton>
            <BaseButton
              classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px] w-full"
              onClick={() => {
                handleApply();
              }}
            >
              {t('applyBtn')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] max-w-[860px] flex-row justify-between gap-0 overflow-hidden p-0">
        <div className="flex basis-1/3 items-center bg-lightGrey p-8">
          <div
            style={{ backgroundColor: colors.backgroundColor }}
            className="flex w-64 flex-col gap-2 rounded-lg p-6 shadow-menus"
          >
            <div
              style={{ backgroundColor: colors.headlineColor }}
              className="h-3 w-2/3 rounded-lg bg-black"
            ></div>
            <div
              style={{ backgroundColor: colors.textColor }}
              className="h-2 w-full rounded-lg bg-gray-500"
            ></div>
            <div className="h-2 w-10/12 rounded-lg bg-gray-500"></div>
            <Ellipse fill={colors.accentColor} />
          </div>
        </div>
        <div className="flex w-full basis-2/3 flex-col gap-0 p-8">
          <DialogHeader className="mb-2 w-full">
            <DialogTitle>
              <p className="text-[24px] font-bold">{t('title')}</p>
            </DialogTitle>
            <DialogDescription className="mb-6 flex flex-col items-start">
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-10">
            {Object.entries(colors).map(([key, color]) => {
              return (
                <div key={key} className="mb-2 mt-8 flex flex-row items-center justify-start gap-2">
                  <ColorPickerCircle
                    currentColor={color}
                    onColorChange={(newColor) => handleChangeColor(newColor, key)}
                  />
                  <div>
                    <p>{t(key)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <BaseButton variant="outline" classNames="px-9" onClick={onOpenChange}>
              {t('cancelBtn')}
            </BaseButton>
            <BaseButton
              classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px]"
              onClick={() => {
                handleApply();
              }}
            >
              {t('applyBtn')}
            </BaseButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomColorModal;
