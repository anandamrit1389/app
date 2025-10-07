import HeroImg from '@/assets/landing/hero.png';
import { useTranslation } from 'react-i18next';

const VideoSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="w-full">
      <div className="pointer-events-none relative mx-auto max-w-7xl rounded-2xl border-2 border-white/20 px-4 ">
        <h2 className="gradient-text text-center text-[38px] font-semibold leading-[54px] md:text-[53px] md:leading-[64px]">
          {t('mainImageTitle2')}
          <br />
          {t('mainImageTitle3')}
        </h2>
        <img src={HeroImg} alt="" />
        {/* <h2 className="absolute bottom-[10%] left-[20%] max-w-[60vw] text-[5vw] font-bold leading-none text-white sm:max-w-[400px] sm:text-4xl md:max-w-[600px] md:text-5xl lg:max-w-[800px] lg:text-7xl">
          {t("mainImageTitle")}
        </h2> */}
      </div>
    </section>
  );
};

export default VideoSection;

/* <iframe
          className="mb-6 aspect-video w-full rounded-2xl [filter:drop-shadow(0px_24px_68.4px_rgba(11,17,55,0.08))_drop-shadow(0px_16px_68.4px_rgba(11,17,55,0.08))]"
          src="https://www.youtube.com/embed/5wRl4zerY-M?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=5wRl4zerY-M&disablekb=1&cc_load_policy=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */
