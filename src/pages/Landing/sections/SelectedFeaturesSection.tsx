import { useTranslation } from 'react-i18next';
import LandingButton from './components/LandingButton';
import { selectedFeatureSection } from './constants/selected-features.const';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';

const SelectedFeaturesSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });
  const navigate = useLocaleNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col rounded-[16px] bg-secondaryBg py-10 md:py-20">
          <div>
            <p className="gradient-text mb-2 text-center text-[12px] font-semibold uppercase  tracking-mini tablet:mb-1 small-desktop:mb-1">
              {t(selectedFeatureSection.label)}
            </p>
            <h1 className="px-4 text-center font-semibold text-darkHeadline text-sectionTitle">
              {t(selectedFeatureSection.title)}
            </h1>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-0 self-center tablet:flex-row tablet:gap-6 small-desktop:flex-row small-desktop:gap-9 desktop:gap-20">
            {selectedFeatureSection.features.map((feature) => {
              return (
                <div
                  key={feature.title}
                  className="tablet:pt-6small-desktop:basis-3/12 flex max-w-[332px] basis-2/5 flex-col justify-between pt-10 text-center tablet:basis-4/12 small-desktop:pt-6 desktop:basis-3/12 desktop:pt-6"
                >
                  <div>
                    <div className="mb-2 flex flex-col items-center">{feature.icon}</div>
                    <p className="font-semibold text-darkHeadline text-bodyMedium">
                      {t(feature.title)}
                    </p>
                    <p className="text-darkText text-bodyMedium">{t(feature.description)}</p>
                  </div>
                  <div className="mt-4 flex flex-col items-center tablet:mt-4 small-desktop:mt-4">
                    <LandingButton onClick={handleClick}>{t(feature.btnLabel)}</LandingButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedFeaturesSection;
