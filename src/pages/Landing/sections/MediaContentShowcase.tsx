import { useTranslation } from 'react-i18next';
import LandingTag from './components/LandingTag';
import { mediaContentShowcaseData } from './constants/media-content-showcase-data';
import { Link } from 'react-router-dom';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const MediaContentShowcase = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'landing.mediaContentShowcase',
  });

  return (
    <section className="pb-10">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="mb-10 flex flex-col space-y-10">
          {mediaContentShowcaseData.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-8 md:flex-row">
              <div
                className={`w-full md:w-1/2 ${item.imagePosition === 'right' ? '' : 'md:order-2'}`}
              >
                <div className="mb-6">
                  <LandingTag label={t(item.tagKey)} />
                </div>
                <div className="mb-4 text-xs font-semibold uppercase tracking-mini text-redText">
                  {t(item.labelKey)}
                </div>
                <h2 className="mb-4 text-4xl font-semibold text-darkHeadline">
                  {t(item.titleKey)}
                </h2>
                <p className="mb-6 text-darkText">{t(item.descriptionKey)}</p>
              </div>

              <div
                className={`w-full md:w-1/2 ${
                  item.imagePosition === 'right' ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <img src={item.imgUrl} alt={t(item.titleKey)} className="h-auto w-full" />
              </div>
            </div>
          ))}
        </div>
        <Link to="/signup" onClick={() => analyticsService.landingPageSignup()}>
          <BaseButton variant="secondary" isDark size="sm" classNames="mt-10 px-14 h-10 mx-auto">
            {t('cta')}
          </BaseButton>
        </Link>
      </div>
    </section>
  );
};

export default MediaContentShowcase;
