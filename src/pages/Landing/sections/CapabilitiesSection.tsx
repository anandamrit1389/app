import { Trans, useTranslation } from 'react-i18next';
import { capabilities } from './constants/capabilities.const';

const CapabilitiesSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <div className="m-auto w-full max-w-screen-big-desktop">
      <div className="mx-4 mb-10 flex pt-3 tablet:mx-8 tablet:mb-16 tablet:pt-14 small-desktop:mx-[152px] small-desktop:mb-20 small-desktop:pt-20">
        <div
          className="mx-0 pb-0 tablet:pb-10 small-desktop:pb-14
               desktop:mx-24 desktop:pb-14 big-desktop:mx-32
            "
        >
          {capabilities.map((capability) => {
            return (
              <div
                key={capability.description}
                className="mb-6 flex flex-col justify-between tablet:flex-row small-desktop:tablet:flex-row desktop:tablet:flex-row small-desktop:gap-10 desktop:gap-20"
              >
                <div className="mb-2 flex basis-full items-stretch gap-3 md:mb-0 tablet:basis-2/6 small-desktop:basis-2/6 desktop:basis-2/6">
                  <div className="self-center">{capability.icon}</div>
                  <div className="self-center">
                    <h4 className="ml-2 font-semibold text-darkHeadline text-sectionSubtitle">
                      <Trans i18nKey={capability.titleKey}>{capability.title}</Trans>
                    </h4>
                  </div>
                </div>
                <div className="basis-full tablet:basis-3/6 small-desktop:basis-4/6 desktop:basis-4/6">
                  <p className="text-darkText text-bodyMedium md:text-left">
                    {t(capability.description)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesSection;
