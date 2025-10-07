import { useTranslation } from 'react-i18next';
import { benefitsOverviewData } from './constants/benefits-overview-data.const';
import { Link } from 'react-router-dom';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const BenefitsOverview = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="mb-9">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="flex flex-col items-center justify-center pt-20">
          <h3 className="mb-6 text-center text-[36px] font-semibold leading-[48px] text-darkHeadline">
            {t('benefitsHeader')}
          </h3>
          <ul className="grid w-full grid-cols-1 gap-10 px-12 md:grid-cols-3">
            {benefitsOverviewData.map((item) => (
              <li key={item.id} className="flex flex-col items-center">
                <img src={item.icon} alt="" className="mb-2" />
                <h4 className="text-center text-[18px] font-semibold leading-[28px] text-darkHeadline">
                  {t(item.titleKey)}
                </h4>
                <p className="max-w-[252px] text-center text-[18px] leading-[28px] text-darkText">
                  {t(item.descriptionKey)}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/signup" onClick={() => analyticsService.landingPageSignup()}>
            <BaseButton variant="secondary" isDark size="sm" classNames="mt-10 px-14 h-10">
              {t('startForFree')}
            </BaseButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BenefitsOverview;
