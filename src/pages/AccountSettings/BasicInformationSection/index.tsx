import { Input } from '@/components/ui/input';
import { getUserFirstName, getUserLastName } from '@/helpers/utils/parsers';
import { User } from '@/interfaces/IUser';
import { accountSettingsSchema } from '@/schemas/accountSettings.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserService from '@/api/userService';
import { toast } from 'sonner';
import { setUserInfoToStorage } from '@/helpers/utils/storage';
import { RefObject, useCallback, useContext, useEffect } from 'react';
import { debounce } from '@/helpers/utils/debounce';
import UploadIcon from '@/assets/upload.svg?react';
import DeleteIcon from '@/assets/delete.svg?react';
import { AuthContext } from '@/providers/auth.provider';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { getInitials } from '@/helpers/utils/user';
import { cn } from '@/lib/utils';

type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;

interface AccountSettingsFormProps {
  user: User;
  sectionRef: RefObject<HTMLDivElement>;
}

interface NewUserInfo {
  id: string;
  name: string;
  email: string;
  profileImg?: string | null;
}

const BasicInformationSection = ({ user, sectionRef }: AccountSettingsFormProps) => {
  const { handleUserInfo } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  const { isMobile } = useDeviceDetect();

  const form = useForm<AccountSettingsValues>({
    defaultValues: user
      ? {
          firstName: getUserFirstName(user.name),
          lastName: getUserLastName(user.name),
          email: user.email,
          profileImg: user.profileImg,
        }
      : undefined,

    resolver: zodResolver(accountSettingsSchema),
  });

  const debouncedSubmit = useCallback(
    debounce((data) => {
      onSubmit(data);
    }, 700),
    [],
  );

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await UserService.uploadPicture(formData);
      form.setValue('profileImg', response.data.profileImg);
      setUserInfoToStorage(response.data);
      handleUserInfo({ user: response.data });

      toast.success(t('successMessageFileUpload'));
    } catch (error) {
      toast.error(t('errorMessageFileUpload'));
      console.error(error);
    }
  }

  async function onSubmit(data: AccountSettingsValues) {
    try {
      const newUserInfo: NewUserInfo = {
        id: user.id,
        name: [data.firstName, data.lastName].filter(Boolean).join(' '),
        email: data.email,
      };

      if (!data.profileImg) {
        newUserInfo.profileImg = null;
      }

      const response = await UserService.updateUser(newUserInfo);
      setUserInfoToStorage(response.data);
      handleUserInfo({ user: response.data });

      toast.success(t('successMessageAccUpdate'));
    } catch (error) {
      toast.error(t('errorMessageAccUpdate'));
      console.error(error);
    }
  }

  const handleRemoveProfilePicture = async () => {
    form.setValue('profileImg', null);
    handleUserInfo({ user: { ...user, profileImg: null } });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSubmit(value);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSubmit]);

  return (
    <div className="overflow-y-auto flex flex-col gap-6">
      <div
        id="basic-information"
        ref={sectionRef}
        className={cn('p-10 bg-white ', {
          'px-4 py-6': isMobile,
          'rounded-lg': !isMobile,
        })}
      >
        <div
          className={cn('w-10/12 flex flex-col gap-4', {
            'w-12/12': isMobile,
          })}
        >
          <p className="font-semibold text-base text-darkHeadline">{t('basicInfo')}</p>
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <div className="flex items-center flex-wrap gap-y-4">
                <Avatar className="w-16 h-16 md:w-20 md:h-20 border-[2px] border-white shadow-[0_2px_2px_0_rgba(0,0,0,0.12)] mr-4">
                  <AvatarImage src={user.profileImg ?? undefined} className="object-cover" />
                  <AvatarFallback>{getInitials(user)}</AvatarFallback>
                </Avatar>

                <div className="flex items-center">
                  <label
                    htmlFor="profileImg"
                    className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border-[1.5px] border-lightGreyPress bg-transparent px-3 py-1 text-sm font-semibold text-darkText transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover"
                  >
                    <UploadIcon />
                    {isMobile ? t('imgUploadBtnShort') : t('imgUploadBtn')}
                    <Input
                      id="profileImg"
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      className="invisible absolute z-[-1] w-0 opacity-0"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <BaseButton
                        classNames="ml-2 py-1 px-3 h-8 text-[#B12525] transition-colors hover:border-[#D1D5DB] hover:bg-[#F8F9FA] active:bg-lightGreyHover"
                        size="sm"
                        variant="outline"
                        icon={<DeleteIcon />}
                      >
                        {t('removeBtn')}
                      </BaseButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[440px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('removePictureModalTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('removePictureModalDescription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover">
                          {t('cancelBtn')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-[#B12525] transition-colors hover:bg-[#961f1f] active:bg-[#7c1a1a]"
                          onClick={handleRemoveProfilePicture}
                        >
                          {t('removeBtn')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[#030712]">{t('firstName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('firstNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[#030712]">{t('lastName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('lastNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#030712]">{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('emailPlaceholder')} {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
