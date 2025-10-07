import landingCreateImg from '@/assets/landing/landing-create-block.jpg';
import { useTranslation } from 'react-i18next';
import LandingTag from './components/LandingTag';

interface ICreatePresentationSection {
  label: string;
  title: string;
  description: string;
  action: string;
  imgUrl: string;
}

const section: ICreatePresentationSection = {
  label: 'createPresentationTagline',
  title: 'createPresentationTitle',
  description: 'createPresentationDescription',
  action: 'createPresentationAction',
  imgUrl: landingCreateImg,
};

const CreatePresentationsSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="flex flex-col-reverse items-stretch justify-between gap-0 tablet:flex-row tablet:gap-8 small-desktop:flex-row small-desktop:gap-32 medium-desktop:gap-32 desktop:gap-32">
          <div className="size-[455px] shrink-0 overflow-hidden rounded-[16px]">
            <img className="size-full" src={section.imgUrl} alt="" />
          </div>
          <div className="mb-10 mt-6 flex w-full max-w-[552px] flex-col self-center tablet:my-0">
            <LandingTag label={t(section.action)} />
            <p className="mb-4 mt-[22px] text-xs font-semibold uppercase tracking-mini text-redText tablet:mt-4">
              {t(section.label)}
            </p>
            <h3 className="mb-4 font-semibold text-sectionTitle">{t(section.title)}</h3>
            <p className="text-darkText text-bodyMedium ">{t(section.description)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePresentationsSection;
