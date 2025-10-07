import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { InviteSchema } from '@/schemas/invite.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import { Input } from '@/components/ui/input';
import { InviteData } from '@/interfaces/Invite';
import { useState } from 'react';
import X from '@/assets/x.svg?react';
import MoodSad from '@/assets/mood-sad.svg?react';
import { SkippedUser } from '@/interfaces/companies';

interface IProps {
  open: boolean;
  limitSeatsToAdd?: number;
  onOpenChange: () => void;
  onInviteAction: (emails: string[]) => Promise<SkippedUser[]>;
}

const InviteMemberModal = ({ open, onOpenChange, onInviteAction, limitSeatsToAdd }: IProps) => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'inviteModal' });

  const [invitingEmails, setInvitingEmails] = useState<string[]>([]);
  const [unableToInvite, setUnableToInvite] = useState<SkippedUser[]>([] as SkippedUser[]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isLoading },
  } = useForm<InviteData>({
    resolver: zodResolver(InviteSchema),
  });

  const onSubmit: SubmitHandler<InviteData> = async (data) => {
    if (limitSeatsToAdd && limitSeatsToAdd - invitingEmails.length <= 0) {
      setError('email', {
        message: 'You have reached the limit of available seats.',
      });
    }
    if (data.email) {
      setInvitingEmails((prev) => Array.from(new Set([...prev, data.email])));
      reset();
    } else {
      setError('email', { message: 'Email field is required' });
    }
  };

  const handleInviteClick = async () => {
    const skippedUsers = await onInviteAction(invitingEmails);
    setInvitingEmails([]);
    setUnableToInvite(skippedUsers);
  };

  const handleCancelClick = () => {
    setInvitingEmails([]);
    setUnableToInvite([]);
    reset();
    onOpenChange();
  };

  const handleRemoveInvite = (invite: string) => {
    setInvitingEmails((prev) => prev.filter((item) => item !== invite));
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full flex-col gap-0 overflow-auto px-4 pb-4 pt-0 transition-all"
        >
          <div className="flex items-center justify-between py-[7px]">
            <BaseButton variant="ghost" onClick={onOpenChange} classNames="px-0 h-[56px]">
              <ArrowBack />
            </BaseButton>
            <SheetHeader className="">
              <SheetTitle>{t('title')}</SheetTitle>
            </SheetHeader>

            <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={onOpenChange}>
              <ArrowBack />
            </BaseButton>
          </div>
          <div className="mb-2 mt-4 flex flex-col items-start ">
            <p>{t('description')}</p>
          </div>
          <div className="flex h-full flex-col justify-between ">
            <div className="mb-2 w-full flex-initial">
              <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
                <div className="relative flex gap-2">
                  <Input
                    {...register('email', {
                      required: true,
                    })}
                    disabled={
                      limitSeatsToAdd ? limitSeatsToAdd - invitingEmails.length <= 0 : false
                    }
                    placeholder="Email"
                    type="text"
                    className="h-10"
                  />
                  <BaseButton type="submit" loading={isLoading} variant="outline" classNames="px-9">
                    {t('addBtn')}
                  </BaseButton>
                </div>
                {errors.email && <ErrorText error={errors.email.message || ''} />}
              </form>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {invitingEmails.map((item) => (
                <div
                  key={item}
                  className="flex items-center 
                gap-2 rounded-full border
                 border-solid border-[#F8D7D7] bg-[#FFF0F0] px-3 py-[6px] text-[14px]"
                >
                  {item}
                  <X
                    onClick={() => handleRemoveInvite(item)}
                    className="cursor-pointer [&_path]:stroke-darkText"
                  />
                </div>
              ))}
            </div>
            {!!unableToInvite.length && (
              <div className="mb-6 flex flex-col border-t pt-6">
                <div className="flex flex-col items-start">
                  <div className="mb-2 flex items-center gap-1">
                    <MoodSad />
                    <p className="text-[14px] font-bold">{t('unableTitle')}</p>
                  </div>
                  <p className="mb-2 text-[14px]">{t('unableDescription')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unableToInvite.map((item) => (
                    <div
                      key={item.email}
                      className="flex items-center 
                gap-2 rounded-full border
                 border-solid border-[#B12525] px-3 py-[6px] text-[14px]"
                    >
                      {item.email}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex justify-between gap-2">
              <BaseButton
                loading={isLoading}
                variant="outline"
                classNames="px-9 w-full"
                onClick={handleCancelClick}
              >
                {t('cancelBtn')}
              </BaseButton>
              <BaseButton
                loading={isLoading}
                disabled={!invitingEmails.length}
                classNames="text-white w-full  px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[48px]"
                onClick={handleInviteClick}
              >
                {t('inviteBtn')}
              </BaseButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] max-w-[544px] flex-col gap-0 overflow-hidden p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[24px] font-bold">{t('title')}</DialogTitle>
          <DialogDescription className="mb-6 flex flex-col items-start">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col  justify-center">
          <div className="mb-2 flex-initial">
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
              <div className="relative flex gap-2">
                <Input
                  {...register('email', {
                    required: true,
                  })}
                  disabled={limitSeatsToAdd ? limitSeatsToAdd - invitingEmails.length <= 0 : false}
                  placeholder="Email"
                  type="text"
                  className="h-10"
                />
                <BaseButton type="submit" loading={isLoading} variant="outline" classNames="px-9">
                  {t('addBtn')}
                </BaseButton>
              </div>
              {errors.email && <ErrorText error={errors.email.message || ''} />}
            </form>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {invitingEmails.map((item) => (
              <div
                key={item}
                className="flex items-center 
                gap-2 rounded-full border
                 border-solid border-[#F8D7D7] bg-[#FFF0F0] px-3 py-[6px] text-[14px]"
              >
                {item}
                <X
                  onClick={() => handleRemoveInvite(item)}
                  className="cursor-pointer [&_path]:stroke-darkText"
                />
              </div>
            ))}
          </div>
          {!!unableToInvite.length && (
            <div className="mb-6 flex flex-col border-t pt-6">
              <div className="flex flex-col items-start">
                <div className="mb-2 flex items-center gap-1">
                  <MoodSad />
                  <p className="text-[14px] font-bold">{t('unableTitle')}</p>
                </div>
                <p className="mb-2 text-[14px]">{t('unableDescription')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {unableToInvite.map((item) => (
                  <div
                    key={item.email}
                    className="flex items-center 
                gap-2 rounded-full border
                 border-solid border-[#B12525] px-3 py-[6px] text-[14px]"
                  >
                    {item.email}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <BaseButton
              loading={isLoading}
              variant="outline"
              classNames="px-9"
              onClick={handleCancelClick}
            >
              {t('cancelBtn')}
            </BaseButton>
            <BaseButton
              loading={isLoading}
              disabled={!invitingEmails.length}
              classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px]"
              onClick={handleInviteClick}
            >
              {t('inviteBtn')}
            </BaseButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
