import { ThemeSchema } from '@/interfaces/theme.interface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { FeatureKey } from '@/interfaces/IUser';
import ProCrown from '@/assets/pro-crown.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CustomColorModal from '@/components/Modals/CustomColorModal';
import { ThemeColors } from '@/interfaces/companies';
import UserService from '@/api/userService';
import { setUserInfoToStorage } from '@/helpers/utils/storage';
import { toast } from 'sonner';
import useMobile from '@/hooks/useMobile';
import MobileThemeSelector from './MobileThemeSelector';
import { themeCatalog } from '@/helpers/constants/themes.const';

interface IProps {
  theme: string;
  toggleTheme: (theme: string) => void;
  extraThemes?: ThemeSchema[];
  themesDefault: ThemeSchema[];
  template?: string;
}

const ThemeSelector = ({ theme, toggleTheme, extraThemes, themesDefault, template }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { user, featuresAccess, handleUserInfo } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [openThemeModal, setOpenThemeModal] = useState(false);
  const isMobile = useMobile();

  const handleApplyUserColors = async (colors: ThemeColors) => {
    if (theme !== 'personal') toggleTheme('personal');
    
    if (user?.id) {
      const localUser = { ...user, themeColors: colors };
      setUserInfoToStorage(localUser);
      handleUserInfo({ user: localUser });

      UserService.updateUserField({ id: user.id, themeColors: colors })
        .catch(err => console.error(err));
    }
    
    toast.success(t('successMessageAccUpdate'));
  };
  const { onOpenChange } = useSubscriptionModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themes = !template
    ? themesDefault
    : themesDefault.filter((t) => t.templates.includes(template) || t.templates.length === 0);

  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-[500] uppercase">{t('colors')}</p>
        </div>
        <div className="p-2 border rounded-md cursor-pointer" onClick={() => setOpen(true)}>
          <div className="flex items-center gap-2">
            <span>{theme === 'personal' && 'Personal colors'}</span>
            {theme === 'personal' ? (
              user?.themeColors && (
                <div className="flex">
                  {[
                    user.themeColors.backgroundColor,
                    user.themeColors.headlineColor,
                    user.themeColors.textColor,
                    user.themeColors.accentColor,
                  ].map((color, index) => (
                    <div
                      key={`preview-${index}`}
                      className="-me-1.5 size-[20px] rounded-full border-2"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="flex">
                {currentTheme &&
                  Object.values(currentTheme.colors).map((color, index) => (
                    <div
                      key={`preview-${index}`}
                      className="-me-1.5 size-[20px] rounded-full border-2"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        <MobileThemeSelector
          open={open}
          setOpen={setOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          extraThemes={extraThemes}
          themesDefault={themesDefault}
          template={template}
          onEditPersonalColors={() => setOpenThemeModal(true)}
        />

        <CustomColorModal
          open={openThemeModal}
          onOpenChange={() => setOpenThemeModal((prev) => !prev)}
          onAction={handleApplyUserColors}
          themeColors={user?.themeColors || null}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-[500] uppercase">{t('colors')}</p>
      </div>
      <Select onValueChange={toggleTheme} value={theme} open={open}>
        <SelectTrigger onClick={() => setOpen(!open)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="w-full"
          onClick={() => setOpen(false)}
          ref={selectRef}
        >
          {featuresAccess[FeatureKey.CUSTOM_COLORS].hasAccess ? (
            <SelectItem
              className="relative w-full rounded-none justify-between border-b border-black/8 group [&_svg.lucide.lucide-check]:group-hover:hidden"
              value="personal"
            >
              <div className="flex w-full items-center justify-between gap-12">
                <span className="text-[14px]">{t('personalColors')}</span>
                <div className="flex items-center gap-2">
                  <BaseButton
                    variant="ghost"
                    classNames="absolute right-0 py-1 px-2 text-sm opacity-0 z-[5] group-hover:opacity-100 transition-opacity  border border-black/7 my-1 bg-white"
                    onClick={() => setOpenThemeModal(true)}
                  >
                    {t('edit')}
                  </BaseButton>
                  <div className="group-hover:hidden">
                    {user?.themeColors && (
                      <div className="flex pe-1">
                        {[
                          user.themeColors.backgroundColor,
                          user.themeColors.headlineColor,
                          user.themeColors.textColor,
                          user.themeColors.accentColor,
                        ].map((color, index) => (
                          <div
                            key={`personal-${index}`}
                            className="-me-1.5 size-[24px] rounded-full border-2"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SelectItem>
          ) : (
            <div
              className="relative border-b border-black/8 flex select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-lightGrey hover:bg-lightGrey focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer justify-between w-full gap-20"
              onClick={() => {
                setOpen(false);
                onOpenChange?.();
              }}
            >
              <span className="text-[14px]">{t('personalColors')}</span>
              <div className="flex items-center rounded-sm gap-1 bg-[#BD9E60] px-1.5 py-0.5 mr-4 text-[12px] text-white font-[500]">
                <ProCrown className="size-5" /> {t('pro')}
              </div>
            </div>
          )}
          {!!extraThemes?.length && (
            <>
              {extraThemes
                .filter((variation) => variation.id !== 'personal')
                .map((variation) => (
                  <SelectItem className="w-full" key={variation.id} value={variation.id}>
                    <div className="flex pe-1">
                      {Object.values(variation.colors).map((v, index) => (
                        <div
                          key={v + index}
                          className="-me-1.5 size-[24px] rounded-full border-2"
                          style={{ backgroundColor: v }}
                        ></div>
                      ))}
                    </div>
                  </SelectItem>
                ))}
              <SelectSeparator />
            </>
          )}
          {themes?.length && (
            <>
              {themes
                .filter((variation) => variation.id !== 'personal')
                .map((variation) => (
                  <SelectItem className="w-full" key={variation.id} value={variation.id}>
                    <div className="flex pe-1">
                      {Object.values(variation.colors).map((v, index) => (
                        <div
                          key={v + index}
                          className="-me-1.5 size-[24px] rounded-full border-2"
                          style={{ backgroundColor: v }}
                        ></div>
                      ))}
                    </div>
                  </SelectItem>
                ))}
              <SelectSeparator />
            </>
          )}
        </SelectContent>
      </Select>

      <CustomColorModal
        open={openThemeModal}
        onOpenChange={() => setOpenThemeModal((prev) => !prev)}
        onAction={handleApplyUserColors}
        themeColors={user?.themeColors || null}
      />
    </div>
  );
};

export default ThemeSelector;
