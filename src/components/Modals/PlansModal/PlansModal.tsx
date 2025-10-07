import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';
import useFetch from '@/hooks/useFetch';
import subscriptionService from '@/api/subscriptionService';
import { ISubscriptionPlan, IntervalType, IInterval } from '@/interfaces/ISubscription';
import { Switcher } from '@/components/CustomUI/Switcher/';
import PlanCard from './PlanCard';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { setLastVisitedRouteToStorage } from '@/helpers/utils/storage';
import PaymentFailedModal from '../PaymentFailedModal/PaymentFailedModal';

const availableIntervals: IInterval[] = [
  {
    title: 'Monthly',
    titleKey: 'monthly',
    type: IntervalType.MONTH,
  },
  {
    title: 'Annually',
    titleKey: 'annually',
    type: IntervalType.YEAR,
  },
];

const PlansModal = () => {
  const { open, onOpenChange, filters } = useSubscriptionModal();

  const isMobile = useMobile();

  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'pricingPlans',
  });

  const [isOpenFailedModal, setIsOpenFailedModal] = useState(false);
  const [selctedInterval, setSelectedInterval] = useState(availableIntervals[0]);

  const [filteredPlans, setPlans] = useState<ISubscriptionPlan[]>([]);

  const { data: groupPlans, loading } = useFetch(subscriptionService.getAllPricingPlans);

  const handleClick = async (priceId: string, seats: number) => {
    try {
      const res = await subscriptionService.userSubscribe(priceId, seats, i18n.language);
      await setLastVisitedRouteToStorage();
      window.location.href = res.url;
    } catch {
      setIsOpenFailedModal(true);
    }
  };

  const handleSwitch = (option: IInterval) => {
    setSelectedInterval(option);
  };

  useEffect(() => {
    if (groupPlans)
      setPlans(
        groupPlans[selctedInterval.type]
          ? groupPlans[selctedInterval.type].filter((plan) => filters.includes(plan.type))
          : [],
      );
  }, [groupPlans, selctedInterval, filters]);

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            outsideclose="true"
            side="left"
            className="flex w-full flex-col overflow-auto px-5 pt-0 transition-all"
          >
            <div className="flex items-center justify-between">
              <BaseButton variant="ghost" onClick={onOpenChange} classNames="px-0 h-[56px]">
                <ArrowBack />
              </BaseButton>
              <SheetTitle>{t('pricingTitle')}</SheetTitle>
              <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={onOpenChange}>
                <ArrowBack />
              </BaseButton>
            </div>
            <SheetHeader className="pt-6">
              <SheetTitle className="text-center text-[28px] font-semibold	leading-9">
                {t('title')}
              </SheetTitle>
              <SheetDescription className=" text-center text-[16px] leading-6 text-[#6b7280]">
                {t('description')}
              </SheetDescription>
            </SheetHeader>
            <Switcher
              className="mb-6 mt-8"
              options={availableIntervals}
              activeOption={selctedInterval}
              getKey={(o) => o.type}
              onSwitch={handleSwitch}
              renderOption={(o) => o.title}
            />
            <div className="flex flex-row gap-x-4 overflow-x-auto flex-nowrap">
              {loading ? (
                <div className="mx-auto">{t('loading')}</div>
              ) : (
                filteredPlans.map((plan) => (
                  <div key={plan.id} className="min-w-[280px] max-w-[320px] flex-shrink-0">
                    <PlanCard key={plan.id} plan={plan} onSelectPlan={handleClick} />
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
        <PaymentFailedModal open={isOpenFailedModal} onClick={() => setIsOpenFailedModal(false)} />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="mb-8 flex max-h-[calc(100dvh-32px)] max-w-[800px] flex-col overflow-hidden overflow-y-auto px-16">
          <DialogHeader className="mb-2 pt-6">
            <DialogTitle className="mb-4 text-center text-[32px]	font-semibold">
              {t('title')}
            </DialogTitle>
            <DialogDescription className=" text-center text-[18px] leading-4 text-[#6b7280]">
              {t('description')}
            </DialogDescription>
          </DialogHeader>
          <Switcher
            className="mb-10"
            options={availableIntervals}
            activeOption={selctedInterval}
            getKey={(o) => o.type}
            onSwitch={handleSwitch}
            renderOption={(o) => t(o.titleKey)}
          />
          <div className="flex gap-4 justify-center">
            {loading ? (
              <div className="mx-auto">{t('loading')}</div>
            ) : (
              filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onSelectPlan={handleClick} />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PaymentFailedModal open={isOpenFailedModal} onClick={() => setIsOpenFailedModal(false)} />
    </>
  );
};

export default PlansModal;
