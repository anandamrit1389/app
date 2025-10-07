import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InviteSchema } from '@/schemas/invite.schema';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import useMobile from '@/hooks/useMobile';
import { InviteData } from '@/interfaces/Invite';
import Coins from '@/assets/coins-color.svg?react';
import { useEffect, useState } from 'react';
import { analyticsService } from '@/helpers/services/AnalyticsService';

interface InviteModalProps {
  open: boolean;
  onOpenChange: () => void;
  onInviteAction: (emails: string[], lang: string) => Promise<void>;
  isMobile?: boolean;
}

const InviteModal = ({ open, onOpenChange, onInviteAction }: InviteModalProps) => {
  const isMobile = useMobile();
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'dashboard.invite_modal',
  });
  const [inviteSent, setInviteSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<InviteData>({
    resolver: zodResolver(InviteSchema),
  });

  useEffect(() => {
    if (open) {
      reset();
      setInviteSent(false);
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<InviteData> = async (data) => {
    if (data.email) {
      analyticsService.inviteSend();
      await onInviteAction([data.email], i18n.language);
      setInviteSent(true);
    } else {
      setError('email', { message: 'Email field is required' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`border-none bg-transparent p-0 px-4`} closeButtonMargin>
        <DialogTitle className="hidden">{t('title')}</DialogTitle>
        <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-[#FFF0F0]">
              <Coins className="size-6" />
            </div>

            <h2 className="text-2xl font-bold">{t('title')}</h2>
            <p className="px-2 text-center text-sm text-tertiaryText">
              {t('descriptionBefore')}{' '}
              <span className="font-semibold text-black">{t('credits')}</span>{' '}
              {t('descriptionAfter')}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-6"
          >
            <div className="relative w-full">
              <Input
                {...register('email', { required: true })}
                placeholder="Email"
                type="text"
                className="h-12 w-full"
                onChange={() => analyticsService.inviteAddEmail()}
              />
              {errors.email && <ErrorText error={errors.email.message || ''} />}
            </div>

            {inviteSent && (
              <div className="w-full rounded-lg text-sm">
                <p className="text-center font-bold">{t('thankYou')}</p>
                <p className="text-center text-tertiaryText">{t('inviteSent')}</p>
              </div>
            )}

            <BaseButton
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              classNames={`${isMobile ? 'w-full' : 'w-[180px]'} text-white h-10`}
            >
              {t('sendInvite')}
            </BaseButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
