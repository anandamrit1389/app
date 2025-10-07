import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  HexColorPicker,
  HexColorInput,
  RgbColorPicker,
  HslColorPicker,
  RgbColor,
  HslColor,
} from 'react-colorful';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useMobile from '@/hooks/useMobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

type FormatType = 'rgb' | 'hsl' | 'hex';

const formatTypes: FormatType[] = ['hex', 'hsl', 'rgb'];

const isValidRgb = (color: string): boolean => {
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  return rgbRegex.test(color);
};

const isValidHsl = (color: string): boolean => {
  const hslRegex = /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
  return hslRegex.test(color);
};

const rgbToString = (rgb: { r: number; g: number; b: number }) => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

const hslToString = (hsl: { h: number; s: number; l: number }) => {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};

const getColorFormat = (color: string): FormatType => {
  if (isValidRgb(color)) return 'rgb';
  if (isValidHsl(color)) return 'hsl';
  return 'hex';
};

const initRgb: RgbColor = { r: 0, g: 0, b: 0 };
const initHsl: HslColor = { h: 0, s: 0, l: 0 };
const initHex: string = '#ffffff';

const parseColor = (color: string, format: FormatType): string | HslColor | RgbColor => {
  if (format === 'rgb' && (color === '' || isValidRgb(color))) {
    if (color === '') {
      return initRgb;
    }
    const rgbArray = color.match(/\d+/g);
    if (rgbArray) {
      const [r, g, b] = rgbArray.map(Number);
      return { r, g, b };
    }
  }
  if (format === 'hsl' && (color === '' || isValidHsl(color))) {
    if (color === '') {
      return initHsl;
    }
    const hslArray = color.match(/\d+/g);
    if (hslArray) {
      const [h, s, l] = hslArray.map(Number);
      return { h, s, l };
    }
  }
  return color || initHex;
};

interface IProp {
  isOpen: boolean;
  onOpenChange: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  children: React.ReactNode;
}

const ColorPickerPopover = ({
  currentColor,
  onColorChange,
  children,
  isOpen,
  onOpenChange,
}: IProp) => {
  const isMobile = useMobile();
  const [colorFormat, setColorFormat] = useState<FormatType>('hex');
  const [inputHexValue, setInputHEXValue] = useState<string>(initHex);
  const [inputRGBValue, setInputRGBValue] = useState<RgbColor>(initRgb);
  const [inputHSLValue, setInputHSLValue] = useState<HslColor>(initHsl);

  const handleHEXColorChange = (newColor: string) => {
    setInputHEXValue(newColor);
    onColorChange(newColor);
  };
  const handleRGBColorChange = (newColor: RgbColor) => {
    const colorString = rgbToString(newColor);
    setInputRGBValue(newColor);
    onColorChange(colorString);
  };
  const handleHSLColorChange = (newColor: HslColor) => {
    const colorString = hslToString(newColor);
    setInputHSLValue(newColor);
    onColorChange(colorString);
  };

  const handleChangeFormat = (format: FormatType) => {
    setColorFormat(format);
    if (format === 'hex') {
      onColorChange(inputHexValue);
    }
    if (format === 'rgb') {
      onColorChange(rgbToString(inputRGBValue));
    }
    if (format === 'hsl') {
      onColorChange(hslToString(inputHSLValue));
    }
  };

  const handleRGBInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputRGBValue((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    onColorChange(
      rgbToString({
        ...inputRGBValue,
        [name]: Number(value),
      }),
    );
  };

  const stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleHSLInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputHSLValue((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    onColorChange(
      hslToString({
        ...inputHSLValue,
        [name]: Number(value),
      }),
    );
  };

  const handleHexInputChange = (newColor: string) => {
    setInputHEXValue(newColor);
    onColorChange(newColor);
  };

  const renderColorPicker = () => {
    switch (colorFormat) {
      case 'rgb':
        return <RgbColorPicker color={inputRGBValue} onChange={handleRGBColorChange} />;
      case 'hsl':
        return <HslColorPicker color={inputHSLValue} onChange={handleHSLColorChange} />;
      default:
        return <HexColorPicker color={inputHexValue} onChange={handleHEXColorChange} />;
    }
  };

  const renderColorInput = () => {
    switch (colorFormat) {
      case 'rgb':
        return (
          <div className="flex w-full flex-row gap-2">
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">r</Label>
              <Input
                value={inputRGBValue.r}
                name="r"
                onChange={handleRGBInputChange}
                min={0}
                max={255}
              />
            </div>
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">g</Label>
              <Input
                value={inputRGBValue.g}
                name="g"
                onChange={handleRGBInputChange}
                min={0}
                max={255}
              />
            </div>
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">b</Label>
              <Input
                value={inputRGBValue.b}
                name="b"
                onChange={handleRGBInputChange}
                min={0}
                max={255}
              />
            </div>
          </div>
        );
      case 'hsl':
        return (
          <div className="flex w-full flex-row gap-2">
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">h</Label>
              <Input
                value={inputHSLValue.h}
                name="h"
                onChange={handleHSLInputChange}
                min={0}
                max={360}
                type="number"
              />
            </div>
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">s</Label>
              <Input
                value={inputHSLValue.s}
                name="s"
                onChange={handleHSLInputChange}
                min={0}
                max={100}
                type="number"
              />
            </div>
            <div className="flex flex-row items-center">
              <Label className="mr-1 uppercase">l</Label>
              <Input
                value={inputHSLValue.l}
                name="l"
                onChange={handleHSLInputChange}
                min={0}
                max={100}
                type="number"
              />
            </div>
          </div>
        );
      default:
        return (
          <HexColorInput
            prefixed
            color={inputHexValue}
            onChange={handleHexInputChange}
            className="h-10 w-full rounded-md border border-gray-300 p-2"
          />
        );
    }
  };

  useEffect(() => {
    const initialFormat = getColorFormat(currentColor);
    setColorFormat(initialFormat);
    const parsedColor = parseColor(currentColor, initialFormat);
    switch (initialFormat) {
      case 'rgb':
        setInputRGBValue(parsedColor as RgbColor);
        break;
      case 'hsl':
        setInputHSLValue(parsedColor as HslColor);
        break;
      default:
        setInputHEXValue(parsedColor as string);
    }
  }, [currentColor]);

  if (isMobile) {
    return (
      <Drawer dismissible={false} open={isOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="flex  w-full flex-col gap-0 px-4 pb-4 pt-2 transition-all">
          <DrawerTitle />
          <DrawerDescription />
          <div className="color-picker" onClick={stopPropagation}>
            {renderColorPicker()}
          </div>
          <div className="mt-4 flex flex-row items-center justify-between gap-2">
            <div>
              <Select onValueChange={handleChangeFormat} value={colorFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {formatTypes.map((variation) => (
                    <SelectItem key={variation} value={variation}>
                      <div className="flex gap-1">
                        <p className="uppercase">{variation}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-wrap">{renderColorInput()}</div>
          </div>
          <BaseButton
            classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px] w-full mt-2"
            onClick={onOpenChange}
          >
            {`Done`}
          </BaseButton>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="right" className="w-[350px] p-1" sideOffset={100}>
        <div className="color-picker">{renderColorPicker()}</div>
        <div className="mt-4 flex flex-row items-center gap-2">
          <div>
            <Select onValueChange={handleChangeFormat} value={colorFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {formatTypes.map((variation) => (
                  <SelectItem key={variation} value={variation}>
                    <div className="flex gap-1">
                      <p className="uppercase">{variation}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-wrap">{renderColorInput()}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default ColorPickerPopover;
