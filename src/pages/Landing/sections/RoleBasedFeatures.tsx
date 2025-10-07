import { useTranslation } from 'react-i18next';
import { roleBasedFeaturesData } from './constants/role-based-features-data.const';

const RoleBasedFeatures = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="mb-10 w-full">
      <div className="mx-auto max-w-[1136px] px-4">
        <div className="flex flex-col gap-5 px-0">
          {roleBasedFeaturesData.map((item) => (
            <div key={item.id} className="flex flex-col gap-6 md:flex-row md:gap-20">
              <p className="flex w-full shrink-0 items-center gap-4 font-semibold text-darkHeadline md:max-w-[200px]  lg:max-w-[348px]">
                <span
                  style={{ background: item.bgIcon }}
                  className="flex size-12 items-center justify-center rounded-full p-1"
                >
                  <img src={item.icon} alt="" />
                </span>
                {t(item.titleKey)}
              </p>
              <p className="text-darkText">{t(item.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleBasedFeatures;
