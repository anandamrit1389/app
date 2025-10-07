import { Link } from 'react-router-dom';
import AccountIcon from '@/assets/account.svg?react';
import { PurchaseData } from '@/interfaces/IPayment';
import { getPlanDisplayName, formatDate } from '@/helpers/utils/paymentUtils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import PartyPopperIcon from '@/assets/party.svg?react';
import PricingBackground from '@/assets/pricing-page-bg.png';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader/DashboardHeader';
import { useTranslation } from 'react-i18next';
import { currencySymbols } from '@/helpers/constants/currency.const';

interface PaymentSuccessModalProps {
  open: boolean;
  mode: string;
  onSuccessPage?: boolean;
  purchaseData?: PurchaseData;
}

function PaymentSuccessModal({ open, mode, purchaseData }: PaymentSuccessModalProps) {
  const navigate = useLocaleNavigate();

  const handleRedirect = (route: string) => {
    navigate(route);
  };
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'paymentSuccessModal',
  });

  const getModalContent = () => {
    const planName = getPlanDisplayName(mode, purchaseData);
    const rawAmount = purchaseData?.amount || 0;
    const currencySymbol = currencySymbols[purchaseData?.currency || 'usd'];
    const interval = purchaseData?.interval;
    const quantity = purchaseData?.quantity;
    const formattedAmount =
      interval === 'per_time'
        ? `${currencySymbol}${rawAmount}`
        : `${currencySymbol}${rawAmount * (quantity || 1)}/${t(`${purchaseData?.interval}`)}`;

    const formattedNextBilling = purchaseData?.nextBilling
      ? formatDate(purchaseData.nextBilling, i18n.language)
      : 'N/A';

    switch (mode) {
      case 'pro':
        return {
          title: t('purchaseCompleteTitle'),
          subtitle: t('upgradeProSubtitle'),
          plan: planName,
          amount: formattedAmount,
          nextBilling: formattedNextBilling,
        };
      case 'enterprise':
        return {
          title: t('purchaseCompleteTitle'),
          subtitle: t('upgradeEnterpriseSubtitle'),
          plan: planName,
          amount: formattedAmount,
          nextBilling: formattedNextBilling,
        };
      case 'credit':
        return {
          title: t('purchaseCompleteTitle'),
          subtitle: t('purchaseCreditsSubtitle'),
          plan: planName,
          credits: purchaseData?.credits || 0,
          amount: formattedAmount,
          expiredCredit: purchaseData?.expiredCredit || 'N/A',
        };
      default:
        return {
          title: t('purchaseCompleteTitle'),
          subtitle: t('defaultSubtitle'),
          plan: planName,
          amount: formattedAmount,
          nextBilling: formattedNextBilling,
        };
    }
  };

  const content = getModalContent();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <DashboardHeader />
      </div>

      <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 size-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${PricingBackground})`,
            backgroundPosition: 'center center',
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-10 size-full bg-white/70" />
        </div>

        <div className="relative z-10 mx-4 w-full max-w-lg rounded-[16px] bg-white p-8 shadow-xl">
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto mt-2 rounded-full p-3">
                <PartyPopperIcon className="mx-auto size-10" />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900">{content.title}</h2>
              <p className="text-base text-gray-600">{content.subtitle}</p>
            </div>

            <div className="space-y-0">
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-600">{t('plan')}</span>
                <span className="font-semibold text-gray-900">{content.plan}</span>
              </div>
              <hr className="border-gray-200" />

              {mode === 'credit' && (
                <>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-gray-600">{t('aiCredit')}</span>
                    <span className="font-semibold text-gray-900">{content.credits}</span>
                  </div>
                  <hr className="border-gray-200" />
                </>
              )}

              <div className="flex items-center justify-between py-4">
                <span className="text-gray-600">{t('amount')}</span>
                <span className="font-semibold text-gray-900">{content.amount}</span>
              </div>
              <hr className="border-gray-200" />

              {mode !== 'credit' && (
                <>
                  <div className="flex items-center justify-between py-4">
                    <span className="text-gray-600">{t('nextBilling')}</span>
                    <span className="font-semibold text-gray-900">{content.nextBilling}</span>
                  </div>
                  <hr className="border-gray-200" />
                </>
              )}

              <div className="flex items-center justify-between py-4">
                <span className="text-gray-600">{t('paymentMethod')}</span>
                <span className="font-semibold text-gray-900">
                  {purchaseData?.paymentMethod || t('defaultPaymentMethod')}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Link
                className="w-40 rounded-lg bg-[#FF6B47] px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-[#FF5534]"
                to="/dashboard"
              >
                {t('close')}
              </Link>

              <BaseButton
                variant="ghost"
                classNames="rounded-lg border border-gray-300 hover:bg-gray-50 px-8 py-4 font-semibold text-gray-700 transition-colors flex items-center gap-2"
                onClick={() => handleRedirect('/profile')}
              >
                <AccountIcon />
                {t('account')}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccessModal;
