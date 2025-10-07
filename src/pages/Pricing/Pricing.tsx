import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useTranslation } from 'react-i18next';
import LandingHeader from '@/pages/Landing/sections/LandingHeader';
import FooterSection from '@/pages/Landing/sections/FooterSection';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { IInterval, IntervalType } from '@/interfaces/ISubscription';
import subscriptionService from '@/api/subscriptionService';
import { ISubscriptionPlan } from '@/interfaces/ISubscription';
import { useState, useEffect } from 'react';
import PaymentFailedModal from '@/components/Modals/PaymentFailedModal/PaymentFailedModal';
import { Switcher } from '@/components/CustomUI/Switcher';
import { Loader } from 'lucide-react';
import SubscriptionCard from '@/components/Modals/SubscriptionModal/SubscriptionCard';
import SubscriptionFAQ from '@/components/Modals/SubscriptionModal/SubscriptionFAQ';
import { setLastVisitedRouteToStorage, setSelectedPricingPlan } from '@/helpers/utils/storage';
import AIPrompt from '@/assets/ai-stars-1.svg?react';
import PricingBackground from '@/assets/pricing-page-bg.png';
import useFetch from '@/hooks/useFetch';
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

interface PricingContentProps {
  ctaText?: string;
  ctaClick?: () => void;
  freeText?: string;
  freeClick?: () => void;
}

const PricingPage = () => {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();

  useEffect(() => {
    analyticsService.landingPagePricing();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };
  

  return (
    <>
      <LandingHeader />
      <PricingContent
        ctaText={t('pricingPlans.buyButton')} 
        ctaClick={handleLogin}
        freeText={t('prompt.backBtn')}
        freeClick={handleBack}
      />
      <FooterSection />
    </>
  );
};

const PricingContent = ({ ctaText, ctaClick, freeText, freeClick }: PricingContentProps) => {
  const [isOpenFailedModal, setIsOpenFailedModal] = useState(false);
  const [selctedInterval, setSelectedInterval] = useState(availableIntervals[0]);
  const [filteredPlans, setPlans] = useState<ISubscriptionPlan[]>([]);

  const { data: groupPlans, loading } = useFetch(subscriptionService.getAllPricingPlans);

  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'pricingPlans',
  });

  const handleClick = async (priceId: string, seats: number) => {
    if (ctaClick) {
      setSelectedPricingPlan(priceId, seats);
      ctaClick();
      return;
    }

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

  const handleContinueFree = () => {
    if (freeClick) {
      freeClick();
      return;
    }
  };

  useEffect(() => {
    if (groupPlans) setPlans(groupPlans[selctedInterval.type] || []);
  }, [groupPlans, selctedInterval]);

  return (
    <>
      <section className="main w-full min-h-screen flex flex-col items-center relative">
        <div
          className="absolute inset-0 w-full h-full bg-center bg-no-repeat z-0 md:bg-[length:100%_auto] bg-[length:170%_auto]"
          style={{
            backgroundImage: `url(${PricingBackground})`,
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 bg-gradient-to-b from-white/40 from-10% via-white/100 via-25% to-white to-35% lg:from-transparent lg:from250% lg:via-white/100 lg:via-50% lg:to-white lg:to-80%" />
        </div>
        <div className="wrapper relative z-10 w-full max-w-[900px] flex flex-col items-center mt-12">
          <AIPrompt className="size-8 mx-auto" />
          <h2 className="text-center text-xs font-semibold text-darkText leading-6 uppercase md:mt-2 mt-1 tracking-mini">
            {t('title_1')}
          </h2>
          <h2 className="text-center md:text-[64px] text-[36px] font-bold text-black mt-1">
            {t('pricing_title')}
          </h2>
          <p className="mx-auto text-center text-base leading-6 text-tertiaryText mt-1 md:whitespace-nowrap">
            {t('description')}
          </p>
          <div className="mt-10 w-full flex justify-center">
            <Switcher
              options={availableIntervals}
              activeOption={selctedInterval}
              getKey={(o) => o.type}
              onSwitch={handleSwitch}
              renderOption={(o) => t(o.titleKey)}
              className="text-black"
            />
          </div>
          <div
            className={`flex flex-col md:flex-row mt-10 ${
              filteredPlans.length > 1 ? 'justify-between gap-8' : 'justify-center'
            }`}
          >
            {loading ? (
              <Loader className="animate-spin [&_path]:stroke-white" />
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
          <div className="w-full mt-20">
            <SubscriptionFAQ />
          </div>
          <div className="mt-8 mb-8 flex flex-col items-center gap-4">
            <BaseButton
              onClick={handleContinueFree}
              variant="ghost"
              classNames="w-max mx-auto text-black"
            >
              {freeText}
            </BaseButton>
          </div>
        </div>
        <PaymentFailedModal open={isOpenFailedModal} onClick={() => setIsOpenFailedModal(false)} />
      </section>
    </>
  );
};

export default PricingPage;
