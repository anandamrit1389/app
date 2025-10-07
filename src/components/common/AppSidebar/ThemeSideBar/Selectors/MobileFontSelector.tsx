import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { FontScheme } from '@/interfaces/font.interface';
import FontSetOption from '@/components/FontSetOption';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResizeIndicator from '@/assets/resize-indicator.svg?react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFont: string;
  onFontChange: (font: string) => void;
  fonts: FontScheme[];
  extraFonts: FontScheme[];
}

const MobileFontSelector = ({
  open,
  onOpenChange,
  currentFont,
  onFontChange,
  fonts,
  extraFonts,
}: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleFontSelect = (fontFamily: string) => {
    onFontChange(fontFamily);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] rounded-t-[24px] flex flex-col">
        <ResizeIndicator className="absolute top-2 left-0 w-full" />
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="uppercase text-left text-[14px] font-[500]">
            {t('fontFamily')}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-2 flex flex-col gap-2 overflow-y-auto">
          {!!extraFonts?.length && (
            <>
              {extraFonts?.map((variation) => (
                <div
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1 rounded-[4px]',
                    currentFont === variation.id && 'bg-gray-50',
                  )}
                  key={variation.id}
                  onClick={() => handleFontSelect(variation.id)}
                >
                  <FontSetOption fontSet={variation.fonts} />
                  {currentFont === variation.id && <Check className="size-[16px] text-primary" />}
                </div>
              ))}
            </>
          )}
          {fonts?.map((variation) => (
            <div
              className={cn(
                'w-full flex items-center justify-between px-2 py-1 rounded-[4px]',
                currentFont === variation.id && 'bg-gray-50',
              )}
              key={variation.id}
              onClick={() => handleFontSelect(variation.id)}
            >
              <FontSetOption fontSet={variation.fonts} />
              {currentFont === variation.id && <Check className="size-6 text-primary" />}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFontSelector;
