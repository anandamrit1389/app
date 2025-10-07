import landingCreateImg from '@/assets/landing/convert-youtube.png';
import { useTranslation } from 'react-i18next';
import LandingTag from './components/LandingTag';

interface IConvertYoutubeSectionSection {
  label: string;
  title: string;
  description: string;
  action: string;
  imgUrl: string;
}

const section: IConvertYoutubeSectionSection = {
  label: 'convertYoutubeTagline',
  title: 'convertYoutubeTitle',
  description: 'convertYoutubeDescription',
  action: 'convertYoutubeAction',
  imgUrl: landingCreateImg,
};

const ConvertYoutubeSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col-reverse items-stretch justify-between gap-0 tablet:flex-row tablet:gap-8 small-desktop:flex-row">
          <div className="flex shrink-0 items-center md:max-w-[400px] lg:max-w-full">
            <img className="rounded-[16px]" src={section.imgUrl} alt="" />
          </div>
          <div className="mb-10 mt-6 flex w-full flex-col self-center tablet:my-0">
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

export default ConvertYoutubeSection;
