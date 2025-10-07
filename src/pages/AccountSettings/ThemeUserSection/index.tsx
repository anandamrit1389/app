import { ThemeColors } from '@/interfaces/companies';
import { RefObject, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { User } from '@/interfaces/IUser';
import CustomColorModal from '@/components/Modals/CustomColorModal';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ColorSwatch from '@/assets/color-swatch.svg?react';
import { AuthContext } from '@/providers/auth.provider';
import UserService from '@/api/userService';
import { toast } from 'sonner';
import { setUserInfoToStorage } from '@/helpers/utils/storage';

interface IProps {
  user: User;
  sectionRef: RefObject<HTMLDivElement>;
}

const ThemeUserSection = ({ user, sectionRef }: IProps) => {
  const { handleUserInfo } = useContext(AuthContext);

  const [openThemeModal, setOpenThemeModal] = useState(false);

  const isMobile = useMobile();

  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  const handleApplyUserColors = async (colors: ThemeColors) => {
    try {
      const resp = await UserService.updateUser({
        id: user.id,
        themeColors: colors,
      });
      setUserInfoToStorage(resp.data);
      handleUserInfo({ user: resp.data });

      toast.success(t('successMessageAccUpdate'));
    } catch (error) {
      toast.error(t('errorMessageAccUpdate'));
      console.error(error);
    }
  };

  return (
    <div
      id="user-theme"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'px-4 py-6': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-12/12': isMobile,
        })}
      >
        <p className="text-base font-semibold text-darkHeadline">{t('themeTitle')}</p>
        <p className="text-[14px] text-darkHeadline">{t('themeDescription')}</p>
        <div
          className={cn('w-7/12', {
            'w-full': isMobile,
          })}
        >
          <BaseButton
            icon={<ColorSwatch />}
            variant="outline"
            classNames="py-2 px-3"
            onClick={() => setOpenThemeModal(true)}
          >
            {t('customColors')}
          </BaseButton>
        </div>
      </div>
      <CustomColorModal
        open={openThemeModal}
        onOpenChange={() => setOpenThemeModal((prev) => !prev)}
        onAction={handleApplyUserColors}
        themeColors={user.themeColors}
      />
    </div>
  );
};

export default ThemeUserSection;
