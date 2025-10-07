import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import {
  DrawerSelect,
  DrawerSelectTrigger,
  DrawerSelectContent,
  DrawerSelectTitle,
  DrawerSelectItem,
  DrawerSelectDescription,
  DrawerSelectValue,
} from '@/components/ui/drawer-select';
import FontSetOption from '@/components/FontSetOption';
import CustomFontModal from '@/components/Modals/CustomFontModal';
import { FontScheme, IFont, IFontSet } from '@/interfaces/font.interface';
import { presentationFonts } from '@/helpers/constants/fonts.const';

interface IProps {
  isCustom?: boolean;
  isMobile: boolean;
  value?: string | null;
  onChange: (val: string) => void;
  onChangeCustomFonts: (customFonts: IFontSet, ownFonts: IFont[]) => void;
  customFonts: IFontSet | null;
  extraFonts?: FontScheme[];
  uploadedFonts?: IFont[];
  uploadCompanyFont: (formData: FormData) => void;
}

const FontSelector = ({
  isCustom = false,
  isMobile,
  extraFonts = [],
  uploadedFonts = [],
  value,
  customFonts,
  onChange,
  onChangeCustomFonts,
  uploadCompanyFont,
}: IProps) => {
  const [selectFontsOpen, setSelectFontOpen] = useState(false);

  const [openCustomFontModal, setOpenCustomForntModal] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'common' });

  const handleApplyCompanyFonts = (customFonts: IFontSet, ownFonts: IFont[]) => {
    onChangeCustomFonts(customFonts, ownFonts);
  };

  const handleUploadFont = (formData: FormData) => {
    uploadCompanyFont(formData);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    setSelectFontOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <DrawerSelect open={selectFontsOpen} onOpenChange={(isOpen) => setSelectFontOpen(isOpen)}>
          <DrawerSelectTrigger asChild>
            <div onClick={() => setSelectFontOpen(true)}>
              {customFonts && (
                <DrawerSelectValue>
                  <FontSetOption fontSet={customFonts} />
                </DrawerSelectValue>
              )}
            </div>
          </DrawerSelectTrigger>
          <DrawerSelectContent className="flex w-full flex-col gap-0 px-4 pb-4 pt-2 transition-all">
            <DrawerSelectTitle />
            <DrawerSelectDescription />

            {isCustom && (
              <DrawerSelectItem
                isChevron={true}
                onClick={() => {
                  setOpenCustomForntModal(true);
                  setSelectFontOpen(false);
                }}
              >
                <div className="flex items-center">
                  <p>{t('customFonts')}</p>
                </div>
              </DrawerSelectItem>
            )}
            {isCustom && <div className="my-2 w-full border-y" />}
            {extraFonts.map((variation) => (
              <DrawerSelectItem
                key={variation.id}
                className="w-full pl-2"
                onClick={() => handleSelect(variation.id)}
                isSelected={value === variation.id}
              >
                <FontSetOption fontSet={variation.fonts} />
              </DrawerSelectItem>
            ))}

            {!!extraFonts.length && <div className="my-2 w-full border-y" />}
            {presentationFonts.map((variation) => (
              <DrawerSelectItem
                key={variation.id}
                className="w-full pl-2"
                onClick={() => handleSelect(variation.id)}
                isSelected={value === variation.id}
              >
                <FontSetOption fontSet={variation.fonts} />
              </DrawerSelectItem>
            ))}
          </DrawerSelectContent>
        </DrawerSelect>
        {isCustom && (
          <CustomFontModal
            open={openCustomFontModal}
            onOpenChange={() => setOpenCustomForntModal((prev) => !prev)}
            onAction={handleApplyCompanyFonts}
            onUpload={handleUploadFont}
            customFonts={customFonts}
            uploadedFonts={uploadedFonts}
          />
        )}
      </>
    );
  }
  return (
    <>
      <Select
        onValueChange={onChange}
        open={selectFontsOpen}
        onOpenChange={() => setSelectFontOpen((prev) => !prev)}
        value={value || undefined}
      >
        <SelectTrigger>
          {value === 'custom' ? <FontSetOption fontSet={customFonts} /> : <SelectValue />}
        </SelectTrigger>
        <SelectContent align="start" className="w-full">
          {isCustom && (
            <>
              <SelectItem
                className="w-full pl-2"
                value={'custom'}
                isChevron={true}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenCustomForntModal(true);
                  setSelectFontOpen(false);
                }}
              >
                <div className="flex items-center">
                  <p>{t('customFonts')}</p>
                </div>
              </SelectItem>
              <SelectSeparator />
            </>
          )}
          {extraFonts.map((variation) => (
            <SelectItem className="w-full pl-2" key={variation.id} value={variation.id}>
              <FontSetOption fontSet={variation.fonts} />
            </SelectItem>
          ))}
          {(isCustom || !!extraFonts.length) && <SelectSeparator />}
          {presentationFonts.map((variation) => (
            <SelectItem className="w-full pl-2" key={variation.id} value={variation.id}>
              <FontSetOption fontSet={variation.fonts} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <CustomFontModal
          open={openCustomFontModal}
          onOpenChange={() => setOpenCustomForntModal((prev) => !prev)}
          onAction={handleApplyCompanyFonts}
          onUpload={handleUploadFont}
          customFonts={customFonts}
          uploadedFonts={uploadedFonts}
        />
      )}
    </>
  );
};
export default FontSelector;
