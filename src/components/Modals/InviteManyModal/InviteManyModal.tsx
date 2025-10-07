import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InviteSchema } from '@/schemas/invite.schema';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import useMobile from '@/hooks/useMobile';
import { InviteData } from '@/interfaces/Invite';
import { useEffect, useState } from 'react';
import Lock from '@/assets/lock.svg';
import Mission5Img from '@/assets/mission_5.png';
import Mission10Img from '@/assets/mission_10.jpeg';
import { PendingUser, UserMission } from '@/interfaces/IUser';
import UserService from '@/api/userService';
import X from '@/assets/x.svg?react';
import AcceptedInvitationsList from './AcceptedInvitationsList';

export const MISSION_DATA = {
  invite_5_friends: {
    image: Mission5Img,
    titleKey: 'unlock_colors',
    descriptionKey: 'unlock_tiers',
  },
  invite_10_friends: {
    image: Mission10Img,
    titleKey: 'unlock_voice_over',
    descriptionKey: 'unlock_tiers_next',
  },
} as const;

export type MissionId = keyof typeof MISSION_DATA;

interface InviteModalProps {
  open: boolean;
  userMission: UserMission;
  onOpenChange: () => void;
  onInviteAction: (emails: string[], lang: string) => Promise<void>;
  isMobile?: boolean;
}

const InviteManyModal = ({ open, onOpenChange, onInviteAction, userMission }: InviteModalProps) => {
  const isMobile = useMobile();
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'invite_many_modal',
  });
  const [emailList, setEmailList] = useState<PendingUser[]>([]);
  const missionData = MISSION_DATA[userMission.id as MissionId];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteData>({
    resolver: zodResolver(InviteSchema),
  });

  const renderDescription = () => {
    return (
      <p className="font-normal text-darkText">
        {t(missionData.descriptionKey, {
          step: userMission.step,
          totalSteps: userMission.totalSteps,
          requiredInvites: userMission.requiredInvites,
        })}
      </p>
    );
  };

  const onSubmit: SubmitHandler<InviteData> = async (data) => {
    if (data.email) {
      if (!emailList.some((pending) => pending.email.toLowerCase() === data.email.toLowerCase())) {
        setEmailList((prev) => [...prev, { id: null, email: data.email }]);
      }
      reset({ email: '' });
    } else {
      setError('email', { message: 'Email field is required' });
    }
  };
  const onInvite = async () => {
    if (emailList.length > 0) {
      const inviteList = emailList.map((e) => e.email);
      await onInviteAction(inviteList, i18n.language);
      reset();
      onOpenChange();
    } else {
      setError('email', { message: t('email_required') });
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange();
  };

  const removeFromList = async (index: number, pendingId: string | null) => {
    try {
      if (pendingId) {
        await UserService.cancelInvite(pendingId);
      }
      setEmailList((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      console.error(e);
    }
  };

  const progress =
    ((userMission.progress > userMission.requiredInvites
      ? userMission.requiredInvites
      : userMission.progress) /
      userMission.requiredInvites) *
    100;

  useEffect(() => {
    setEmailList(userMission.pending);
  }, [userMission]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="border-0 p-0">
          <div className="flex min-h-screen flex-col justify-between">
            <div>
              <div className="flex flex-col gap-4 bg-default-gradient p-8 ">
                <h2 className={`w-full text-center text-2xl font-bold text-white`}>
                  {t(missionData.titleKey)}
                </h2>
                <div className="relative mx-auto rounded-lg">
                  <img src={missionData.image} className="size-[240px] rounded-lg" />
                  <img
                    src={Lock}
                    alt="lock"
                    className="absolute right-2 top-2 size-6 rounded-full text-white"
                  />
                  <h1 className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 p-4 text-center font-semibold text-white">
                    {t('invite_friends')}
                  </h1>
                </div>

                <div className="flex  h-10 flex-col justify-center ">
                  <div className="relative mx-auto h-1 w-7/12 max-w-[200px] rounded-full bg-white/30">
                    <div
                      className="absolute left-0 top-0 h-1 rounded-full bg-white"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                    <div
                      className="absolute flex w-fit justify-end rounded-full bg-white px-2 py-1 text-sm"
                      style={{
                        left: `${progress}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {userMission.progress}/{userMission.requiredInvites}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 px-4 pt-4">
                <div>
                  <h2 className="mb-1 text-lg font-semibold">{t('invite_earn')}</h2>
                  {renderDescription()}
                </div>
                <div>
                  <div className="relative">
                    <Input
                      {...register('email', { required: true })}
                      placeholder="Email address"
                      type="text"
                      className="h-10"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubmit(onSubmit)();
                        }
                      }}
                    />
                    <BaseButton
                      type="button"
                      onClick={() => handleSubmit(onSubmit)()}
                      variant="outline"
                      classNames="absolute right-[4px] top-1/2 -translate-y-1/2 px-3 py-2"
                    >
                      {t('add')}
                    </BaseButton>
                  </div>
                  {errors.email && <ErrorText error={errors.email.message || ''} />}
                  <p className="mt-2 text-sm text-tertiaryText">
                    {t('invites_accepted', {
                      acceptedInvites: userMission.progress,
                      totalInvites: userMission.totalInvites,
                    })}
                  </p>
                </div>
                <div className="flex max-h-[170px] flex-wrap gap-2 overflow-y-auto py-2">
                  {emailList &&
                    emailList.map((listItem, index) => (
                      <div
                        key={`${listItem}-${index}`}
                        className="flex shrink-0 items-center  gap-2 rounded-full border border-[#F8D7D7] bg-[#fff0f0] px-3 py-1.5"
                      >
                        <span className="text-[12px]">{listItem.email}</span>
                        <X
                          onClick={() => removeFromList(index, listItem.id)}
                          className="cursor-pointer [&_path]:stroke-darkText"
                      />
                    </div>
                  ))}
              </div>
              <AcceptedInvitationsList />
            </div>
            </div>
            <div className="flex flex-col justify-between p-4">
              <div>
                <div className="flex justify-end gap-2">
                  <BaseButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    variant="outline"
                    classNames="px-9 flex-1"
                    onClick={handleCancel}
                  >
                    {t('cancel')}
                  </BaseButton>
                  <BaseButton
                    type="button"
                    loading={isSubmitting}
                    disabled={!emailList.length || isSubmitting}
                    classNames="text-white  px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151] h-[48px] flex-1"
                    onClick={onInvite}
                  >
                    {t('invite')}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[910px] gap-0 border-0 p-0">
        <DialogTitle className="hidden">{t('title')}</DialogTitle>
        <div className="flex">
          <div className="flex w-1/2 flex-col gap-4 rounded-l-lg bg-default-gradient p-8">
            <h2 className={`w-full text-center text-2xl font-bold text-white`}>
              {t(missionData.titleKey)}
            </h2>
            <div className="relative mx-auto rounded-lg">
              <img src={missionData.image} className="size-[300px] rounded-lg" />
              <img
                src={Lock}
                alt="lock"
                className="absolute right-2 top-2 size-6 rounded-full text-white"
              />
              <h1 className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 p-4 text-center font-semibold text-white">
                {t('invite_friends')}
              </h1>
            </div>

            <div className="flex  h-10 flex-col justify-center ">
              <div className="relative mx-auto h-1 w-7/12 rounded-full bg-white/30">
                <div
                  className="absolute left-0 top-0 h-1 rounded-full bg-white"
                  style={{
                    width: `${progress}%`,
                  }}
                />
                <div
                  className="absolute flex w-fit justify-end rounded-full bg-white px-2 py-1 text-sm"
                  style={{
                    left: `${progress}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {userMission.progress}/{userMission.requiredInvites}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-1/2 flex-col justify-between p-8">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="mb-1 text-lg font-semibold">{t('invite_earn')}</h2>
                {renderDescription()}
              </div>
              <div>
                <div className="relative">
                  <Input
                    {...register('email', { required: true })}
                    placeholder="Email address"
                    type="text"
                    className="h-10"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <BaseButton
                    type="button"
                    onClick={() => handleSubmit(onSubmit)()}
                    variant="outline"
                    classNames="absolute right-[4px] top-1/2 -translate-y-1/2 px-3 py-2"
                  >
                    {t('add')}
                  </BaseButton>
                </div>
                {errors.email && <ErrorText error={errors.email.message || ''} />}
                <p className="mt-2 text-sm text-tertiaryText">
                  {t('invites_accepted', {
                    acceptedInvites: userMission.progress,
                    totalInvites: userMission.totalInvites,
                  })}
                </p>
              </div>
              <div className="flex max-h-[170px] flex-wrap gap-2 overflow-y-auto py-2">
                {emailList &&
                  emailList.map((listItem, index) => (
                    <div
                      key={`${listItem}-${index}`}
                      className="flex shrink-0 items-center  gap-2 rounded-full border border-[#F8D7D7] bg-[#fff0f0] px-3 py-1.5"
                    >
                      <span className="text-[12px]">{listItem.email}</span>
                      <X
                        onClick={() => removeFromList(index, listItem.id)}
                        className="cursor-pointer [&_path]:stroke-darkText"
                      />
                    </div>
                  ))}
              </div>
              <AcceptedInvitationsList />
            </div>
            <div>
              <div className="flex justify-end gap-2">
                <BaseButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  variant="outline"
                  classNames="px-9"
                  onClick={handleCancel}
                >
                  {t('cancel')}
                </BaseButton>
                <BaseButton
                  type="button"
                  loading={isSubmitting}
                  disabled={!emailList.length || isSubmitting}
                  classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151] h-[40px]"
                  onClick={onInvite}
                >
                  {t('invite')}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteManyModal;
