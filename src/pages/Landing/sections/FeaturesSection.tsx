import { useTranslation } from 'react-i18next';
import LandingButton from './components/LandingButton';
import { features } from './constants/features.const';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';

const FeaturesSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });
  const navigate = useLocaleNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <section className="pt-10">
      <div className="mx-auto max-w-[1136px] px-4">
        <div className="mb-20 text-center">
          <h2 className="text-[36px] font-semibold leading-[42px] md:text-[42px] md:leading-[56px]">
            {t('featuresSectionTitle')} <span className="gradient-text">Inabit.ai</span>
            {'. '}
            {t('featuresSectionSubtitle')}
          </h2>
        </div>
      </div>
      <div className="bg-[#F6F7F8]">
        <div className="mx-auto max-w-[1136px] px-4">
          <div className="rounded-2xl px-7 py-20">
            <h3 className="mb-6 text-center text-[28px] font-semibold leading-[36px] md:text-[36px] md:leading-[48px]">
              {t('featuresSectionHeading')}
            </h3>

            <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-[18px] leading-[28px]"
                >
                  <div className="text-blue-600 mb-2 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-center font-semibold text-darkHeadline">
                    {t(feature.titleKey)}
                  </h4>
                  <p className="text-center text-darkText">{t(feature.descriptionKey)}</p>
                </div>
              ))}
            </div>

            <LandingButton onClick={handleClick} className="mx-auto !h-10">
              {t('headerCTA')}
            </LandingButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
