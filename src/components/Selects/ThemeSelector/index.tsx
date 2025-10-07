import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeColors, ThemeSchema } from '@/interfaces/theme.interface';
import { defaultThemes } from '@/helpers/constants/themes.const';
import CustomColorModal from '@/components/Modals/CustomColorModal';
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

interface IProps {
  isCustom?: boolean;
  isMobile: boolean;
  value?: string;
  onChange: (val: string) => void;
  onChangeCustomColors: (val: ThemeColors) => void;
  customColors: ThemeColors | null;
  extraThemes?: ThemeSchema[];
}

const ThemeSelector = ({
  isCustom = false,
  isMobile,
  extraThemes = [],
  value,
  customColors,
  onChange,
  onChangeCustomColors,
}: IProps) => {
  const [selectColorsOpen, setSelectColorsOpen] = useState(false);
  const [openThemeModal, setOpenThemeModal] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'common' });

  const handleApplyCompanyColors = (colors: ThemeColors) => {
    onChangeCustomColors(colors);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    setSelectColorsOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <DrawerSelect
          open={selectColorsOpen}
          onOpenChange={(isOpen) => setSelectColorsOpen(isOpen)}
        >
          <DrawerSelectTrigger asChild>
            <div onClick={() => setSelectColorsOpen(true)}>
              {customColors && (
                <DrawerSelectValue>
                  <div key={value} className="flex items-center gap-2">
                    {Object.entries(customColors).map(([colorName, colorValue]) => (
                      <div
                        key={colorName}
                        onClick={() => setSelectColorsOpen(true)}
                        className="size-[24px] rounded-full border-2"
                        style={{ backgroundColor: colorValue }}
                      ></div>
                    ))}
                  </div>
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
                  setOpenThemeModal(true);
                  setSelectColorsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <p>{t('customColors')}</p>
                </div>
              </DrawerSelectItem>
            )}
            {isCustom && <div className="my-2 w-full border-y" />}
            {extraThemes.map((variation) => (
              <DrawerSelectItem
                key={variation.id}
                onClick={() => handleSelect(variation.id)}
                isSelected={value === variation.id}
              >
                <div key={variation.id} className="flex gap-1">
                  {Object.values(variation.colors).map((v) => {
                    return (
                      <div
                        key={v}
                        className="size-[24px] rounded-full border-2"
                        style={{ backgroundColor: v }}
                      ></div>
                    );
                  })}
                </div>
              </DrawerSelectItem>
            ))}
            {!!extraThemes.length && <div className="my-2 w-full border-y" />}
            {defaultThemes.map((variation) => (
              <DrawerSelectItem
                key={variation.id}
                onClick={() => handleSelect(variation.id)}
                isSelected={value === variation.id}
              >
                <div key={variation.id} className="flex gap-1">
                  {Object.values(variation.colors).map((v) => {
                    return (
                      <div
                        key={v}
                        className="size-[24px] rounded-full border-2"
                        style={{ backgroundColor: v }}
                      ></div>
                    );
                  })}
                </div>
              </DrawerSelectItem>
            ))}
          </DrawerSelectContent>
        </DrawerSelect>
        {isCustom && (
          <CustomColorModal
            open={openThemeModal}
            onOpenChange={() => setOpenThemeModal((prev) => !prev)}
            onAction={handleApplyCompanyColors}
            themeColors={customColors}
          />
        )}
      </>
    );
  }
  return (
    <>
      <Select
        onValueChange={onChange}
        value={value}
        open={selectColorsOpen}
        onOpenChange={() => setSelectColorsOpen((prev) => !prev)}
      >
        <SelectTrigger>
          {value === 'custom' && customColors ? (
            <div key={value} className="flex items-center gap-2">
              {Object.entries(customColors).map(([colorName, colorValue]) => (
                <div
                  key={colorName}
                  className="size-[24px] rounded-full border-2"
                  style={{ backgroundColor: colorValue }}
                ></div>
              ))}
            </div>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent align="start" className="w-full">
          {isCustom && (
            <SelectItem
              className="w-full"
              key="custom"
              value="custom"
              isChevron={true}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenThemeModal(true);
                setSelectColorsOpen(false);
              }}
            >
              <div className="flex items-center">
                <p>{t('customColors')}</p>
              </div>
            </SelectItem>
          )}
          {extraThemes.map((variation) => (
            <SelectItem className="w-full" key={variation.id} value={variation.id}>
              <div className="flex gap-1">
                {Object.values(variation.colors).map((v) => {
                  return (
                    <div
                      key={v}
                      className="size-[24px] rounded-full border-2"
                      style={{ backgroundColor: v }}
                    ></div>
                  );
                })}
              </div>
            </SelectItem>
          ))}
          {(isCustom || !!extraThemes.length) && <div className="my-2 w-full border-y" />}
          {defaultThemes.map((variation) => (
            <SelectItem className="w-full" key={variation.id} value={variation.id}>
              <div className="flex gap-1">
                {Object.values(variation.colors).map((v) => {
                  return (
                    <div
                      key={v}
                      className="size-[24px] rounded-full border-2"
                      style={{ backgroundColor: v }}
                    ></div>
                  );
                })}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isCustom && (
        <CustomColorModal
          open={openThemeModal}
          onOpenChange={() => setOpenThemeModal((prev) => !prev)}
          onAction={handleApplyCompanyColors}
          themeColors={customColors}
        />
      )}
    </>
  );
};
export default ThemeSelector;
