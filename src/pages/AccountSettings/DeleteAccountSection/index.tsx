import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import DeleteIcon from '@/assets/delete.svg?react';
import UserService from '@/api/userService';
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { User } from '@/interfaces/IUser';
import { cn } from '@/lib/utils';

interface IProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  user: User;
  isMobile: boolean;
}

const DeleteAccountSection = ({ sectionRef, user, isMobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { handleLogout } = useContext(AuthContext);

  const handleDeleteAccount = async () => {
    try {
      await UserService.deleteUser(user.id);
      toast.success(t('successMessageAccDelete'));
      handleLogout();
    } catch (error) {
      toast.error(t('errorMessageAccDelete'));
      console.error(error);
    }
  };

  return (
    <div
      id="delete-account"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'px-4 py-6': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-full': isMobile,
        })}
      >
        {' '}
        <p className="mb-4 text-base font-semibold text-darkHeadline">{t('deleteAcc')}</p>
        <p className="mb-4 text-sm text-darkText">{t('deleteAccDescription')}</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <BaseButton
            classNames="py-1.5 px-3 text-[#B12525] transition-colors hover:border-[#D1D5DB] hover:bg-[#F8F9FA] active:bg-lightGreyHover"
            size="sm"
            variant="outline"
            icon={<DeleteIcon />}
          >
            {t('removeBtn')}
          </BaseButton>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[440px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteAccModalTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteAccModalDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover">
              {t('cancelBtn')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#B12525] transition-colors hover:bg-[#961f1f] active:bg-[#7c1a1a]"
              onClick={handleDeleteAccount}
            >
              {t('removeBtn')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccountSection;
