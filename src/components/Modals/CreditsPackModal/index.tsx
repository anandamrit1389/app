import { useState } from 'react';
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
import { CreditsPack } from '@/interfaces/ISubscription';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import PaymentFailedModal from '../PaymentFailedModal/PaymentFailedModal';
import { Loader } from 'lucide-react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import CoinFilled from '@/assets/coin-filled.svg?react';
import { setLastVisitedRouteToStorage } from '@/helpers/utils/storage';
import { currencySymbols } from '@/helpers/constants/currency.const';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const CreditsPackModal = () => {
  const { openCreditsModal, onOpenCreditPacksChange } = useSubscriptionModal();

  const isMobile = useMobile();

  const { t, i18n } = useTranslation('translation');

  const [isOpenFailedModal, setIsOpenFailedModal] = useState(false);

  const { data: creditsPack, loading } = useFetch<CreditsPack[]>(
    subscriptionService.getAllCreditPacks,
  );

  const handleClick = async (priceId: string) => {
    try {
      const selectedPack = creditsPack?.find(pack => pack.price.id === priceId);
      if (selectedPack) {
        analyticsService.trackCreditPurchase(selectedPack.credits, selectedPack.price.amount, selectedPack.price.currency);
      }
      
      const res = await subscriptionService.userSubscribe(priceId, 1, i18n.language);
      await setLastVisitedRouteToStorage();
      window.location.href = res.url;
    } catch {
      setIsOpenFailedModal(true);
    }
  };

  const handleContinueFree = () => {
    onOpenCreditPacksChange();
  };

  // useEffect(() => {}, []);

  if (isMobile) {
    return (
      <>
        <Sheet open={openCreditsModal} onOpenChange={handleContinueFree}>
          <SheetContent
            outsideclose="true"
            side="left"
            className="flex w-full flex-col gap-6 overflow-auto px-5 pt-0 transition-all sm:max-w-full"
          >
            <div className="flex items-center justify-between">
              <BaseButton variant="ghost" onClick={handleContinueFree} classNames="px-0 h-[56px]">
                <ArrowBack />
              </BaseButton>
              <SheetTitle>Credits</SheetTitle>
              <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={handleContinueFree}>
                <ArrowBack />
              </BaseButton>
            </div>
            <SheetHeader>
              <SheetTitle className="text-center text-[28px] font-semibold leading-9">
                {t('creditPacksModal.title')}
              </SheetTitle>
              <SheetDescription className=" text-center text-base leading-6 text-[#6b7280]">
                {t('creditPacksModal.description')}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              {loading && (
                <div className="flex justify-center">
                  <Loader className="animate-spin [&_path]:stroke-darkText" />
                </div>
              )}

              {!loading && (
                <div className="flex flex-col gap-2">
                  {creditsPack?.map((pack) => (
                    <div
                      key={pack.id}
                      className="flex flex-col gap-2 border-b border-card-stroke py-2 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <div className="pt-[2px]">
                            <CoinFilled className="size-5" />
                          </div>
                          <div>
                            <h1 className="text-[16px] font-semibold leading-6 text-darkText">{`${
                              pack.credits
                            } ${t('creditPacksModal.title')}`}</h1>
                            <p className="text-sm leading-5  text-tertiaryText">
                              {t('creditPacksModal.itemDescription')}
                            </p>
                          </div>
                          {pack.mostPopular && (
                            <div className="flex h-6 items-center rounded-full bg-secondary-200 px-2">
                              <p className="gradient-text text-[12px] font-semibold uppercase leading-3">
                                {t('creditPacksModal.mostPopular')}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-lg font-semibold text-darkText">{`${
                          currencySymbols[pack.price.currency]
                        }${pack.price.amount}`}</div>
                      </div>
                      <div className="">
                        <BaseButton
                          onClick={() => handleClick(pack.price.id)}
                          classNames="h-10 w-full"
                        >
                          {t('creditPacksModal.btnLabel')}
                        </BaseButton>
                      </div>
                    </div>
                  ))}
                </div>
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
      <Dialog open={openCreditsModal} onOpenChange={handleContinueFree}>
        <DialogContent className="flex max-w-[822px] flex-col gap-6 overflow-hidden overflow-y-auto rounded-2xl px-16 py-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="mb-2 text-center text-[32px] font-semibold leading-10">
              {t('creditPacksModal.title')}
            </DialogTitle>
            <DialogDescription className="mx-auto !mt-0 max-w-[550px] text-center text-base leading-6 text-text-tertiary">
              {t('creditPacksModal.description')}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex justify-center">
              <Loader className="animate-spin [&_path]:stroke-darkText" />
            </div>
          )}

          {!loading && (
            <div className="flex flex-col gap-2">
              {creditsPack?.map((pack) => (
                <div
                  key={pack.id}
                  className="flex justify-between border-b border-card-stroke py-2 last:border-b-0"
                >
                  <div className="flex gap-2">
                    <div className="pt-[2px]">
                      <CoinFilled className="size-5" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold leading-7 text-darkText">{`${
                        pack.credits
                      } ${t('creditPacksModal.title')}`}</h1>
                      <p className="text-sm leading-5  text-tertiaryText">
                        {t('creditPacksModal.itemDescription')}
                      </p>
                    </div>
                    {pack.mostPopular && (
                      <div className="flex h-6 items-center rounded-full bg-secondary-200 px-2">
                        <p className="gradient-text text-[12px] font-semibold uppercase leading-3">
                          {t('creditPacksModal.mostPopular')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-semibold text-darkText">{`${
                      currencySymbols[pack.price.currency]
                    }${pack.price.amount}`}</div>

                    <BaseButton onClick={() => handleClick(pack.price.id)} classNames="h-12  w-36">
                      {t('creditPacksModal.btnLabel')}
                    </BaseButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <PaymentFailedModal open={isOpenFailedModal} onClick={() => setIsOpenFailedModal(false)} />
    </>
  );
};

export default CreditsPackModal;
