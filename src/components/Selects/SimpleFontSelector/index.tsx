import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DrawerSelect,
  DrawerSelectTrigger,
  DrawerSelectContent,
  DrawerSelectTitle,
  DrawerSelectItem,
  DrawerSelectDescription,
  DrawerSelectValue,
} from '@/components/ui/drawer-select';
import { IFont } from '@/interfaces/font.interface';
import { defaultFonts } from '@/helpers/constants/fonts.const';
import TextSize from '@/assets/text-size.svg?react';

interface IProps {
  isMobile: boolean;
  value?: IFont | null;
  onChange: (val: string) => void;
  extraFonts?: IFont[];
}

const SimpleFontSelector = ({ isMobile, extraFonts = [], value, onChange }: IProps) => {
  const [selectFontsOpen, setSelectFontOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setSelectFontOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <DrawerSelect open={selectFontsOpen} onOpenChange={(isOpen) => setSelectFontOpen(isOpen)}>
          <DrawerSelectTrigger asChild>
            <div
              onClick={() => setSelectFontOpen(true)}
              className="flex items-center gap-3"
              style={{ fontFamily: value?.label || undefined }}
            >
              <DrawerSelectValue>
                <TextSize />
                <div style={{ fontFamily: value?.label }} className={`flex gap-2`}>
                  {value?.label}
                </div>
              </DrawerSelectValue>
            </div>
          </DrawerSelectTrigger>
          <DrawerSelectContent className="flex w-full flex-col gap-0 px-4 pb-4 pt-2 transition-all">
            <DrawerSelectTitle />
            <DrawerSelectDescription />
            {extraFonts.map((variation) => (
              <DrawerSelectItem
                key={variation.name}
                className="w-full pl-2"
                onClick={() => handleSelect(variation.name)}
                isSelected={value?.name === variation.name}
              >
                <div style={{ fontFamily: variation.label }} className={`flex gap-2`}>
                  {variation.label}
                </div>
              </DrawerSelectItem>
            ))}

            {!!extraFonts.length && <div className="my-2 w-full border-y" />}
            {defaultFonts.map((variation) => (
              <DrawerSelectItem
                key={variation.name}
                className="w-full pl-2"
                onClick={() => handleSelect(variation.name)}
                isSelected={value?.name === variation.name}
              >
                <div style={{ fontFamily: variation.label }} className={`flex gap-2`}>
                  {variation.label}
                </div>
              </DrawerSelectItem>
            ))}
          </DrawerSelectContent>
        </DrawerSelect>
      </>
    );
  }
  return (
    <>
      <Select
        onValueChange={onChange}
        open={selectFontsOpen}
        onOpenChange={() => setSelectFontOpen((prev) => !prev)}
        value={value?.name || undefined}
      >
        <SelectTrigger>
          <div className="flex items-center gap-3" style={{ fontFamily: value?.name || undefined }}>
            <TextSize />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent align="start" className="w-full">
          {extraFonts.map((variation) => (
            <SelectItem
              className="w-full pl-2"
              key={variation.name}
              value={variation.name}
              style={{ fontFamily: variation.label }}
            >
              <div className={`flex gap-2`}>{variation.label}</div>
            </SelectItem>
          ))}
          {!!extraFonts.length && <SelectSeparator />}
          {defaultFonts.map((variation) => (
            <SelectItem
              className="w-full pl-2"
              key={variation.name}
              value={variation.name}
              style={{ fontFamily: variation.label }}
            >
              <div className={`flex gap-2`}>{variation.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
export default SimpleFontSelector;
