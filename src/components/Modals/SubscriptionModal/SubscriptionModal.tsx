import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import SubscriptionCard from './SubscriptionCard';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { setLastVisitedRouteToStorage } from '@/helpers/utils/storage';
import PaymentFailedModal from '../PaymentFailedModal/PaymentFailedModal';
import { Loader, X } from 'lucide-react';
import Star1 from '@/assets/star-1.svg?react';
import { analyticsService } from '@/helpers/services/AnalyticsService';

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

interface SubscriptionModalProps {
  ctaText?: string;
  ctaClick?: () => void;
  isOpen?: boolean;
  onBack?: () => void;
  freeText?: string;
  freeClick?: () => void;
}

const SubscriptionModal = ({
  ctaText,
  ctaClick,
  isOpen = false,
  freeText,
  freeClick,
  onBack,
}: SubscriptionModalProps) => {
  const { open, onOpenChange, filters } = useSubscriptionModal();

  const isMobile = useMobile();

  const { t, i18n } = useTranslation('translation' );

  const [isOpenFailedModal, setIsOpenFailedModal] = useState(false);
  const [selctedInterval, setSelectedInterval] = useState(availableIntervals[0]);

  const [filteredPlans, setPlans] = useState<ISubscriptionPlan[]>([]);

  const { data: groupPlans, loading } = useFetch(subscriptionService.getAllPricingPlans);

  const handleClose = () => {
    if (onBack) {
      onBack();
      return;
    }

    onOpenChange();
  };

  const handleClick = async (priceId: string, seats: number) => {
    if (ctaClick) {
      ctaClick();
      return;
    }

    try {
      const selectedPlan = filteredPlans.find(plan => plan.price.id === priceId);
      if (selectedPlan) {
        analyticsService.trackSubscriptionStart(selectedPlan.type, 'card');
      }
      
      const res = await subscriptionService.userSubscribe(priceId, seats, i18n.language);
      await setLastVisitedRouteToStorage();
      window.location.href = res.url;
    } catch (error) {
      const selectedPlan = filteredPlans.find(plan => plan.price.id === priceId);
      if (selectedPlan) {
        analyticsService.trackSubscriptionFailure('api_error', selectedPlan.type, 'subscription_failed');
      }
      setIsOpenFailedModal(true);
    }
  };

  const handleSwitch = (option: IInterval) => {
    setSelectedInterval(option);
  };

  const handleContinueFree = () => {
    if (freeClick) {
      freeClick();
      return;
    }
    onOpenChange();
  };
  
  const handleRedeemCode = () => {
    onOpenChange(); 
    setTimeout(() => {
      const lng = i18n.language;
      window.location.href = `/${lng}/profile?section=redeemCode`;
    }, 100);
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
        <Sheet open={open || isOpen} onOpenChange={handleClose}>
          <SheetContent
            outsideclose="true"
            side="left"
            className="flex w-full flex-col overflow-auto px-5 pt-0 transition-all sm:max-w-full"
          >
            <div className="flex items-center justify-between">
              <BaseButton variant="ghost" onClick={handleClose} classNames="px-0 h-[56px]">
                <ArrowBack />
              </BaseButton>
              <SheetTitle className="text-lg font-medium">{t('pricingPlans.pricing')}</SheetTitle>
              <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={handleClose}>
                <ArrowBack />
              </BaseButton>
            </div>
            <SheetHeader className="pt-5">
              <SheetTitle className="text-center text-[28px] font-semibold	leading-9">
                {t('pricingPlans.pricing_title')}
              </SheetTitle>
              <SheetDescription className=" text-center text-[16px] leading-6 text-[#6b7280]">
                {t('subscriptionModal.description')}
              </SheetDescription>
            </SheetHeader>
            <Switcher
              className="mb-6 mt-8"
              options={availableIntervals}
              activeOption={selctedInterval}
              getKey={(o) => o.type}
              onSwitch={handleSwitch}
              renderOption={(o) => t(`pricingPlans.${o.titleKey}`)}
            />
            <div>
              <div className="flex items-center justify-center -mt-6">
                <BaseButton
                  onClick={handleContinueFree}
                  variant="ghost"
                  classNames="w-max text-cta-text-dark"
                >
                  {freeText}
                </BaseButton>
                <span className="text-gray-400">|</span>
                <BaseButton
                  variant="ghost"
                  classNames="w-max text-cta-text-dark font-medium"
                  onClick={handleRedeemCode}
                >
                  {t('account.redeemCode', 'Redeem code')}
                </BaseButton>
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-4">
              {loading ? (
                <Loader className="mx-auto animate-spin [&_path]:stroke-darkText" />
              ) : (
                filteredPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    onSelectPlan={handleClick}
                    ctaText={ctaText}
                  />
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
      <Dialog open={open || isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="mb-8 flex max-h-[calc(100dvh-32px)] max-w-[800px] flex-col  overflow-hidden overflow-y-auto rounded-2xl px-16 gap-1" 
          hideclose
        >
          <div className="absolute right-4 top-4">
            <BaseButton 
              onClick={handleClose}
              variant="ghost"
              size="icon"
              classNames="p-1"
              icon={<X className="h-5 w-5" />}
            />
          </div>
          <DialogHeader className="pt-2">
            <DialogTitle className="text-center text-[32px] font-semibold">
              {t('pricingPlans.pricing_title')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-1 mb-4">
            <BaseButton
              onClick={handleContinueFree}
              variant="ghost"
              classNames="w-max text-cta-text-dark"
            >
              {freeText}
            </BaseButton>
            <span className="text-gray-400">|</span>
            <BaseButton
              variant="ghost"
              classNames="w-max text-cta-text-dark font-medium"
              onClick={handleRedeemCode}
            >
              {t('account.redeemCode', 'Redeem code')}
            </BaseButton>
          </div>
          <Switcher
            options={availableIntervals}
            activeOption={selctedInterval}
            getKey={(o) => o.type}
            onSwitch={handleSwitch}
            renderOption={(o) => (
              <>
                {o.titleKey === 'annually' ? (
                  <div className="flex flex-col items-center relative ">
                    <div className="absolute -top-1 -right-10">
                      <Star1 className="size-5" />
                    </div>
                    {t(`pricingPlans.${o.titleKey}`)}
                    <div className="text-xs font-semibold text-[#BD9E60] uppercase">
                     {t('pricingPlans.best_value')}
                    </div>
                  </div>
                ) : (
                  t(`pricingPlans.${o.titleKey}`)
                )}
              </>
            )}
          />
          <div className="flex justify-center gap-4 mt-4">
            {loading ? (
              <Loader className="animate-spin [&_path]:stroke-darkText" />
            ) : (
              filteredPlans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  onSelectPlan={handleClick}
                  ctaText={ctaText}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PaymentFailedModal open={isOpenFailedModal} onClick={() => setIsOpenFailedModal(false)} />
    </>
  );
};

export default SubscriptionModal;
