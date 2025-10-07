import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import TextSize from '@/assets/text-size.svg?react';
import TextIconGradient from '@/assets/text-icon-gradient.svg?react';
import UploadIcon from '@/assets/upload.svg?react';
import RemoveIcon from '@/assets/remove-icon.svg?react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IFont, IFontSet } from '@/interfaces/font.interface';
import { Input } from '@/components/ui/input';
import { loadFont } from '@/helpers/utils/load-font';
import { defaultFonts } from '@/helpers/constants/fonts.const';
import useMobile from '@/hooks/useMobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import SimpleFontSelector from '@/components/Selects/SimpleFontSelector';

const initCustomFonts: IFontSet = {
  header: undefined,
  body: undefined,
};

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  onAction: (companyFonts: IFontSet, ownFonts: IFont[]) => void;
  onUpload: (formData: FormData) => void;
  customFonts: IFontSet | null;
  uploadedFonts: IFont[];
}

const CustomFontModal = ({
  open,
  onOpenChange,
  onAction,
  onUpload,
  customFonts,
  uploadedFonts,
}: IProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'customFontModal',
  });

  const isMobile = useMobile();

  const [newCustomFonts, setCustomFonts] = useState<IFontSet>(initCustomFonts);

  const [ownFonts, setOwnFonts] = useState<IFont[]>([]);

  const handleApply = () => {
    onAction(newCustomFonts, ownFonts);
    onOpenChange();
  };
  const allFonts = ownFonts.concat(defaultFonts);

  const setFontFamily = (val: string, key: string) => {
    const newVal = allFonts.find((item) => item.name === val);
    setCustomFonts((prev) => {
      return { ...prev, [key]: newVal };
    });
  };

  const handleRemoveFont = (name: string) => {
    setCustomFonts((prevCustomFonts) => {
      const updatedCustomFonts = { ...prevCustomFonts };
      if (updatedCustomFonts.header?.name === name) {
        updatedCustomFonts.header = undefined;
      }
      if (updatedCustomFonts.body?.name === name) {
        updatedCustomFonts.body = undefined;
      }

      return updatedCustomFonts;
    });
    setOwnFonts(ownFonts.filter((item) => item.name !== name));
  };

  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    onUpload(formData);
  };

  const handleCancel = () => {
    onOpenChange();
  };

  useEffect(() => {
    if (customFonts) {
      setCustomFonts(customFonts);
    }
  }, [setCustomFonts, customFonts]);

  useEffect(() => {
    if (uploadedFonts) {
      setOwnFonts(uploadedFonts);
    }
  }, [setOwnFonts, uploadedFonts]);

  useEffect(() => {
    uploadedFonts.forEach((font) => {
      if (font.key && font.link) {
        loadFont(font.name, font.link);
      }
    });
  }, [uploadedFonts]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full flex-col gap-0 overflow-auto px-4 pb-4 pt-0 transition-all"
        >
          <div className="flex items-center justify-between py-[7px]">
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
          <div className="mb-6 mt-4 flex flex-col items-start ">
            <p>{t('description')}</p>
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col">
                <p className="mb-2 text-[14px] font-medium text-darkHeadline">
                  {t('headerFontKey')}
                </p>
                <SimpleFontSelector
                  value={newCustomFonts.header}
                  onChange={(val: string) => setFontFamily(val, 'header')}
                  extraFonts={ownFonts}
                  isMobile={isMobile}
                />
              </div>
              <div className="flex flex-col">
                <p className="mb-2 text-[14px] font-medium  text-darkHeadline">
                  {t('bodyFontKey')}
                </p>
                <SimpleFontSelector
                  value={newCustomFonts.body}
                  onChange={(val: string) => setFontFamily(val, 'body')}
                  extraFonts={ownFonts}
                  isMobile={isMobile}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark">{t('uploadFontsTitle')}</p>
                  <p className="font-normal text-dark">{t('uploadFontsDescription')}</p>
                </div>
                <div className="flex items-center">
                  <label
                    htmlFor="company-font"
                    className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border-[1.5px] border-lightGreyPress bg-transparent px-3 py-2 text-sm font-semibold text-darkText transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover"
                  >
                    <UploadIcon />
                    {t('upload')}
                    <Input
                      id="company-font"
                      type="file"
                      accept=".ttf, .otf, .woff, .woff2"
                      className="invisible absolute z-[-1] w-0 opacity-0"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ownFonts.map((item) => (
                  <div
                    key={item.name}
                    style={{ fontFamily: item.name }}
                    className="flex items-center
                gap-2 rounded-full border border-solid
                 border-[#F8D7D7] bg-[#FFF0F0] px-3 py-1.5 text-[14px]"
                  >
                    <TextIconGradient />
                    {item.label}
                    <RemoveIcon
                      className="cursor-pointer"
                      onClick={() => handleRemoveFont(item.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-between gap-2">
            <BaseButton variant="outline" classNames="px-9 w-full" onClick={handleCancel}>
              {t('cancel')}
            </BaseButton>
            <BaseButton
              classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px] w-full"
              onClick={() => {
                handleApply();
              }}
            >
              {t('apply')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] max-w-[600px] flex-col justify-between gap-0 overflow-hidden p-8">
        <DialogHeader className="mb-6 w-full">
          <DialogTitle>
            <p className="mb-2 text-[24px] font-bold">{t('title')}</p>
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full gap-4">
            <div className="flex basis-1/2 flex-col">
              <p className="mb-2 text-[14px] font-medium text-darkHeadline">{t('headerFontKey')}</p>
              <Select
                onValueChange={(val: string) => setFontFamily(val, 'header')}
                value={newCustomFonts.header?.name}
              >
                <SelectTrigger>
                  <div
                    className="flex items-center gap-3"
                    style={{ fontFamily: newCustomFonts.header?.name }}
                  >
                    <TextSize />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent align="start" className="w-full">
                  {ownFonts.map((variation) => (
                    <SelectItem
                      className="w-full"
                      key={variation.name}
                      value={variation.name}
                      style={{ fontFamily: variation.name }}
                    >
                      <div className={`flex gap-2`}>{variation.label}</div>
                    </SelectItem>
                  ))}
                  {!!ownFonts.length && <SelectSeparator />}
                  {defaultFonts.map((variation) => (
                    <SelectItem
                      className="w-full"
                      key={variation.name}
                      value={variation.name}
                      style={{ fontFamily: variation.name }}
                    >
                      <div className={`flex gap-2`}>{variation.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex basis-1/2 flex-col">
              <p className="mb-2 text-[14px] font-medium  text-darkHeadline">{t('bodyFontKey')}</p>
              <Select
                onValueChange={(val: string) => setFontFamily(val, 'body')}
                value={newCustomFonts.body?.name}
              >
                <SelectTrigger>
                  <div
                    className="flex items-center gap-3"
                    style={{ fontFamily: newCustomFonts.body?.name }}
                  >
                    <TextSize />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent align="start" className="w-full">
                  {ownFonts.map((variation) => (
                    <SelectItem
                      className="w-full"
                      key={variation.name}
                      value={variation.name}
                      style={{ fontFamily: variation.name }}
                    >
                      <div className={`flex gap-2`}>{variation.label}</div>
                    </SelectItem>
                  ))}
                  {!!ownFonts.length && <SelectSeparator />}
                  {defaultFonts.map((variation) => (
                    <SelectItem
                      className="w-full"
                      key={variation.name}
                      value={variation.name}
                      style={{ fontFamily: variation.name }}
                    >
                      <div className={`flex gap-2`}>{variation.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-dark">{t('uploadFontsTitle')}</p>
                <p className="font-normal text-dark">{t('uploadFontsDescription')}</p>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="company-font"
                  className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border-[1.5px] border-lightGreyPress bg-transparent px-3 py-2 text-sm font-semibold text-darkText transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover"
                >
                  <UploadIcon />
                  {t('upload')}
                  <Input
                    id="company-font"
                    type="file"
                    accept=".ttf, .otf, .woff, .woff2"
                    className="invisible absolute z-[-1] w-0 opacity-0"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {ownFonts.map((item) => (
                <div
                  key={item.name}
                  style={{ fontFamily: item.name }}
                  className="flex items-center
                gap-2 rounded-full border border-solid
                 border-[#F8D7D7] bg-[#FFF0F0] px-3 py-1.5 text-[14px]"
                >
                  <TextIconGradient />
                  {item.label}
                  <RemoveIcon
                    className="cursor-pointer"
                    onClick={() => handleRemoveFont(item.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <BaseButton variant="outline" classNames="px-9" onClick={handleCancel}>
            {t('cancel')}
          </BaseButton>
          <BaseButton
            classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px]"
            onClick={() => {
              handleApply();
            }}
          >
            {t('apply')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFontModal;
