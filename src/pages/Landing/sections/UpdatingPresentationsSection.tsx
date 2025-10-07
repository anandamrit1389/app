import landingUpdatingImg from '@/assets/landing/landing-updating-block.png';
import { useTranslation } from 'react-i18next';
import LandingTag from './components/LandingTag';

interface IUpdatePresentationSection {
  label: string;
  title: string;
  description: string;
  action: string;
  imgUrl1: string;
}

const section: IUpdatePresentationSection = {
  label: 'updatePresentationTagline',
  title: 'updatePresentationTitle',
  description: 'updatePresentationDescription',
  action: 'updatePresentationAction',
  imgUrl1: landingUpdatingImg,
};

const UpdatingPresentationsSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="flex flex-col items-stretch justify-between gap-8 tablet:flex-row small-desktop:flex-row">
          <div className="mb-10 flex max-w-[553px] flex-col self-center tablet:mb-0">
            <LandingTag label={t(section.action)} />
            <p className="mb-4 mt-[22px] text-[12px] font-semibold uppercase tracking-mini text-redText tablet:mt-4 small-desktop:mt-6 desktop:mb-[19.23px] desktop:mt-[28.84px]">
              {t(section.label)}
            </p>
            <h3 className="mb-4 font-semibold text-sectionTitle">{t(section.title)}</h3>
            <p className="text-darkText text-bodyMedium">{t(section.description)}</p>
          </div>
          <div className="w-[551px] shrink-0 ">
            <img src={section.imgUrl1} alt="Proportion and Scale." className="size-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatingPresentationsSection;
