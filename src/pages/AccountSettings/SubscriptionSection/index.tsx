import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';

import { User } from '@/interfaces/IUser';
import subscriptionService from '@/api/subscriptionService';
import AccountProUpgrade from '@/components/AccountProUpgrade';
import { cn } from '@/lib/utils';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import EditIcon from '@/assets/edit.svg?react';
import UsersIcon from '@/assets/users.svg?react';
import CalendarIcon from '@/assets/calendar.svg?react';
import { IntervalType } from '@/interfaces/ISubscription';

const TitlePlans = {
  business: 'enterprise',
  pro: 'pro',
  free: '',
};

interface IProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  user: User;
}

const SubscriptionSection = ({ sectionRef, user }: IProps) => {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'account' });
  const { isMobile } = useDeviceDetect();

  if (!user.subscription?.ownedSubscription) {
    return user.subscription?.activeSubscription ? null : (
      <div
        id="subscription-account"
        ref={sectionRef}
        className={cn('p-10 bg-white', {
          'px-4 py-6': isMobile,
          'rounded-lg': !isMobile,
        })}
      >
        <div
          className={cn('w-11/12 ', {
            'w-full': isMobile,
          })}
        >
          <p className="mb-4 text-base font-semibold text-darkHeadline">
            {t('ownSubscriptionTitle')}
          </p>
          <p className="mb-4 text-sm text-darkText">{t('subscriptionDescription')}</p>
          <AccountProUpgrade />
        </div>
      </div>
    );
  }

  const subscription = user.subscription.ownedSubscription;

  const handleEdit = async () => {
    const res = await subscriptionService.userEditSubscribtion(i18n.language);
    window.location.href = res.url;
  };

  const date = new Date(subscription.endDate);
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  return (
    <div
      id="subscription-account"
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
        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-semibold  text-darkHeadline">{t('ownSubscriptionTitle')}</p>

          {subscription.interval !== IntervalType.CUSTOM && (
            <BaseButton
              onClick={handleEdit}
              classNames="px-3 py-2 text-sm"
              variant="outline"
              icon={<EditIcon />}
            >
              {t('editSubscriptionBtn')}
            </BaseButton>
          )}
        </div>
        <p className="text-sm text-darkText">
          {t('unlockSubscriptionDescription', {
            type: TitlePlans[subscription.type],
          })}
        </p>

        {subscription.interval !== IntervalType.CUSTOM && (
          <div>
            <div className="mb-1 flex w-full items-center gap-1 rounded-lg bg-[#F9F7F4] px-3 py-4">
              <UsersIcon />
              <p className="text-sm text-darkText">
                <span className="font-semibold">{t('seats')}</span> {subscription.quantity}
              </p>
            </div>
            <div className="flex w-full items-center gap-1 rounded-lg bg-[#F9F7F4] px-3 py-4">
              <CalendarIcon />
              <p className="text-sm text-darkText">
                <span className="font-semibold">{t('renewal')}</span>{' '}
                {t(`${subscription.interval}`)}
              </p>
            </div>
          </div>
        )}

        <p className="text-sm">
          {subscription.cancelAtPeriodEnd ? t('endDate') : t('nextPayment')} {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSection;
