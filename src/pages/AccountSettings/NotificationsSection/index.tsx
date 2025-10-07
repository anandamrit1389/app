import { RefObject, useCallback, useContext, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { notificationsSettingsSchema } from '@/schemas/accountSettings.schema';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { debounce } from '@/helpers/utils/debounce';
import UserService from '@/api/userService';
import { setUserInfoToStorage } from '@/helpers/utils/storage';
import { AuthContext } from '@/providers/auth.provider';
import { toast } from 'sonner';
import { User } from '@/interfaces/IUser';
import { cn } from '@/lib/utils';

type NotificationsSettingsValues = z.infer<typeof notificationsSettingsSchema>;

interface IProps {
  sectionRef: RefObject<HTMLDivElement>;
  user: User;
  isMobile: boolean;
}

interface NewNotificationsInfo {
  newFeatures: boolean;
  inspirationTutorials: boolean;
  offers: boolean;
}

const NotificationsSection = ({ sectionRef, user, isMobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { handleUserInfo } = useContext(AuthContext);

  const form = useForm<NotificationsSettingsValues>({
    defaultValues: user ? user.notificationsSettings : undefined,

    resolver: zodResolver(notificationsSettingsSchema),
  });

  async function onSubmit(data: NotificationsSettingsValues) {
    try {
      const newNotificationsInfo: NewNotificationsInfo = data;

      const response = await UserService.updateUser({
        notificationsSettings: { ...newNotificationsInfo },
        id: user.id,
      });
      setUserInfoToStorage(response.data);
      handleUserInfo({ user: response.data });

      toast.success(t('successMessageAccUpdate'));
    } catch (error) {
      toast.error(t('errorMessageAccUpdate'));
      console.error(error);
    }
  }

  const debouncedSubmit = useCallback(
    debounce((data) => {
      onSubmit(data);
    }, 700),
    [],
  );

  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSubmit(value);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSubmit]);

  return (
    <Form {...form}>
      <form className="gap-6 space-y-8">
        <div
          id="notifications"
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
            <p className="text-base font-semibold text-darkHeadline">{t('notifications')}</p>
            <div className={cn('flex flex-col gap-3', { 'gap-2': isMobile })}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-darkText">{t('newFeatures')}</span>
                <FormField
                  control={form.control}
                  name="newFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-darkText">{t('inspiration')}</span>
                <FormField
                  control={form.control}
                  name="inspirationTutorials"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-darkText">{t('offers')}</span>
                <FormField
                  control={form.control}
                  name="offers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default NotificationsSection;
