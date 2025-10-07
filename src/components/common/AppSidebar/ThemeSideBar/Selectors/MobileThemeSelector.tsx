import { ThemeSchema } from '@/interfaces/theme.interface';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { FeatureKey } from '@/interfaces/IUser';
import ProCrown from '@/assets/pro-crown.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import ResizeIndicator from '@/assets/resize-indicator.svg?react';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  theme: string;
  toggleTheme: (theme: string) => void;
  extraThemes?: ThemeSchema[];
  themesDefault: ThemeSchema[];
  template?: string;
  onEditPersonalColors: () => void;
}

const MobileThemeSelector = ({
  open,
  setOpen,
  theme,
  toggleTheme,
  extraThemes,
  themesDefault,
  template,
  onEditPersonalColors,
}: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { user, featuresAccess } = useContext(AuthContext);
  const { onOpenChange } = useSubscriptionModal();
  const themes = !template
    ? themesDefault
    : themesDefault.filter((t) => t.templates.includes(template) || t.templates.length === 0);

  const handleThemeSelect = (themeId: string) => {
    toggleTheme(themeId);
    setOpen(false);
  };
  const handleProClick = () => {
    onOpenChange();
    setOpen(false);
  };
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl flex flex-col">
          <ResizeIndicator className="absolute top-2 left-0 w-full" />
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="uppercase text-left text-sm font-medium">
              {t('colors')}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-2 flex flex-col gap-2 overflow-hidden">
            {featuresAccess[FeatureKey.CUSTOM_COLORS].hasAccess ? (
              <div
                className={cn(
                  'border-b border-black/8 p-1 flex items-center justify-between rounded',
                  theme === 'personal' && 'bg-gray-50',
                )}
                onClick={() => handleThemeSelect('personal')}
              >
                <div className="flex items-center gap-2">
                  <span>{t('personalColors')}</span>
                  <BaseButton
                    variant="ghost"
                    classNames="py-1 px-2 text-sm border border-black/7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPersonalColors();
                    }}
                  >
                    {t('editButton')}
                  </BaseButton>
                </div>
                <div className="flex items-center gap-2">
                  {user?.themeColors && (
                    <div className="flex">
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
                        />
                      ))}
                    </div>
                  )}
                  {theme === 'personal' && <Check className="size-5 text-primary" />}
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-between p-1 rounded border-b border-black/8"
                onClick={handleProClick}
              >
                <span>{t('personalColors')}</span>
                <div className="flex items-center rounded-sm gap-1 bg-[var(--pro-badge-bg)] px-1.5 py-0.5 text-[12px] text-white font-[500]">
                  <ProCrown className="size-5" /> {t('pro')}
                </div>
              </div>
            )}

            {!!extraThemes?.length && (
              <>
                {extraThemes.map((variation) => (
                  <div
                    key={variation.id}
                    className={cn(
                      'p-1 flex items-center justify-between rounded',
                      theme === variation.id && 'bg-gray-50',
                    )}
                    onClick={() => handleThemeSelect(variation.id)}
                  >
                    <div className="flex">
                      {Object.values(variation.colors).map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          className="-me-1.5 size-[24px] rounded-full border-2"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {theme === variation.id && <Check className="size-5 text-primary" />}
                  </div>
                ))}
              </>
            )}

            {themes.map((variation) => (
              <div
                key={variation.id}
                className={cn(
                  'p-1 flex items-center justify-between rounded-[4px]',
                  theme === variation.id && 'bg-gray-50',
                )}
                onClick={() => handleThemeSelect(variation.id)}
              >
                <div className="flex">
                  {Object.values(variation.colors).map((color, index) => (
                    <div
                      key={`${color}-${index}`}
                      className="-me-1.5 size-[24px] rounded-full border-2"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {theme === variation.id && <Check className="size-5 text-primary" />}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileThemeSelector;
