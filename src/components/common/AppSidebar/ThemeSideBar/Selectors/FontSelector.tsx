import { useTranslation } from 'react-i18next';
import FontSetOption from '@/components/FontSetOption';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { FontScheme } from '@/interfaces/font.interface';
import MobileFontSelector from './MobileFontSelector';
import { useState } from 'react';
import useMobile from '@/hooks/useMobile';
interface IProps {
  fontFamily: string;
  template: string;
  setFontFamily: (font: string) => void;
  extraFonts?: FontScheme[];
  presentationFonts?: FontScheme[];
}

const FontSelector = ({
  fontFamily,
  template,
  setFontFamily,
  extraFonts,
  presentationFonts,
}: IProps) => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const fontSet = presentationFonts?.find((f) => f.id === fontFamily)?.fonts;
  const availableFonts = presentationFonts?.filter(
    (fontScheme) => fontScheme.templates && fontScheme?.templates.includes(template),
  );

  const isOriginTheme =
    (presentationFonts?.filter((f) => f.templates?.includes(template)).length ?? 0) > 1;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-[500] uppercase">{t('fontFamily')}</p>

        {!isOriginTheme ? (
          <div className="p-1 rounded-md flex items-center gap-3">
            <FontSetOption
              fontSet={
                extraFonts?.find((f) => f.id === fontFamily)?.fonts ||
                availableFonts?.find((f) => f.id === fontFamily)?.fonts
              }
            />
          </div>
        ) : (
          <>
            <div
              className="p-1 border rounded-md cursor-pointer flex items-center gap-3"
              onClick={() => setOpen(true)}
            >
              <FontSetOption fontSet={fontSet} />
            </div>

            <MobileFontSelector
              open={open}
              onOpenChange={setOpen}
              currentFont={fontFamily}
              onFontChange={setFontFamily}
              fonts={availableFonts || []}
              extraFonts={extraFonts || []}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-[500] uppercase">{t('fontFamily')}</p>

      {!isOriginTheme ? (
        <div className="h-12 flex items-center pl-2 rounded-md">
          <FontSetOption
            fontSet={
              extraFonts?.find((f) => f.id === fontFamily)?.fonts ||
              availableFonts?.find((f) => f.id === fontFamily)?.fonts
            }
          />
        </div>
      ) : (
        <Select onValueChange={setFontFamily} value={fontFamily}>
          <SelectTrigger className="h-12">
            <div className="flex items-center gap-3">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent align="start" className="w-full p-1">
            {!!extraFonts?.length && (
              <>
                {extraFonts?.map((variation) => (
                  <SelectItem className="w-full pl-2" key={variation.id} value={variation.id}>
                    <FontSetOption fontSet={variation.fonts} />
                  </SelectItem>
                ))}
                <SelectSeparator />
              </>
            )}
            {availableFonts?.map((variation) => (
              <SelectItem className="w-full pl-2" key={variation.id} value={variation.id}>
                <FontSetOption fontSet={variation.fonts} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default FontSelector;
