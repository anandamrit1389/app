import useMobile from '@/hooks/useMobile';
import inspiration1 from '@/assets/inspiration1.png';
import inspiration2 from '@/assets/inspiration2.png';
import inspiration8 from '@/assets/inspiration8.png';
import inspiration9 from '@/assets/inspiration9.png';
import starInspiration from '@/assets/star-inspiration.svg';
import './Inspiration.css';
import { useCallback, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import InspirationCard from './InspirationCard';
import InspirationArticles from './InspirationArticles';
import useTablet from '@/hooks/useTablet';
import { useTranslation } from 'react-i18next';
import { PRESENTATION_URL } from '@/helpers/constants/presentation.const';

const InspirationImages = [inspiration1, inspiration2, inspiration8, inspiration9];

const InspirationHeader = ({ showHeader }: { showHeader: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'inspiration' });
  return (
    <CSSTransition in={showHeader} timeout={1500} classNames="fade" unmountOnExit>
      <div className="animate-scale">
        <h1 className="max-w-[400px] text-center text-2xl font-semibold leading-none">
          {t('get')} <span className="gradient-text">{t('inspired')}</span> {t('andLearn')}
        </h1>
      </div>
    </CSSTransition>
  );
};

const Inspiration = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [showHeader, setShowHeader] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showImage1, setShowImage1] = useState(false);
  const [randomImage1, setRandomImage1] = useState<string>();
  const [randomImage2, setRandomImage2] = useState<string>();

  useEffect(() => {
    const getRandomImage = (excludeImage?: string) => {
      let availableImages = [...InspirationImages];
      if (excludeImage) {
        availableImages = availableImages.filter((img) => img !== excludeImage);
      }
      return availableImages[Math.floor(Math.random() * availableImages.length)];
    };

    const image1 = getRandomImage();
    const image2 = getRandomImage(image1);

    const preloadImages = async () => {
      const loadImage = (src: string) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
        });
      };

      await Promise.all([loadImage(image1), loadImage(image2)]);
      setRandomImage1(image1);
      setRandomImage2(image2);
      setShowHeader(true);
      setTimeout(() => setShowImage1(true), 900);
      setTimeout(() => setShowImage2(true), 1200);
    };

    preloadImages();

    return () => {
      setShowHeader(false);
      setShowImage1(false);
      setShowImage2(false);
    };
  }, []);

  const handleSeeIntroduction = useCallback(() => {
    window.open(PRESENTATION_URL, '_blank');
  }, []);

  if (isMobile) {
    return (
      <div className="h-full overflow-auto p-4">
        <div className="relative my-9 mb-16 flex flex-col items-center justify-center p-10">
          <CSSTransition in={showHeader} timeout={500} classNames="fade" unmountOnExit>
            <InspirationHeader showHeader={showHeader} />
          </CSSTransition>
          <CSSTransition in={showImage2} timeout={500} classNames="fade" unmountOnExit>
            <div className="absolute bottom-[-20%] right-[5%] h-[50px] w-[90px] rotate-[8deg] rounded-lg">
              <img src={randomImage2} alt="" className="animate-scale rounded-lg" />
            </div>
          </CSSTransition>

          <CSSTransition in={showImage1} timeout={500} classNames="fade" unmountOnExit>
            <div className="absolute left-[5%] top-[-20%] h-[50px] w-[90px] rotate-[-8deg] rounded-lg">
              <img src={randomImage1} alt="" className="animate-scale rounded-lg" />
            </div>
          </CSSTransition>
          <img src={starInspiration} alt="" className="absolute left-[50%] top-0 size-3" />
        </div>
        <InspirationCard isMobile={isMobile} onSeeIntroduction={handleSeeIntroduction} />
        <InspirationArticles />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-16 lg:px-32">
      <div className="relative my-[72px] mb-16 flex flex-col items-center justify-center p-10">
        <CSSTransition in={showHeader} timeout={500} classNames="fade" unmountOnExit>
          <InspirationHeader showHeader={showHeader} />
        </CSSTransition>
        <CSSTransition in={showImage2} timeout={500} classNames="fade" unmountOnExit>
          <div
            className={`absolute ${
              isTablet
                ? 'h-[46px] w-[80px]'
                : 'h-[78.82px] w-[140px] max-[1400px]:h-[61px] max-[1400px]:w-[107px]'
            } right-[5%] top-[-20%] rotate-[8deg] rounded-lg`}
          >
            <img src={randomImage2} alt="" className="animate-scale rounded-lg" />
          </div>
        </CSSTransition>
        <CSSTransition in={showImage1} timeout={500} classNames="fade" unmountOnExit>
          <div
            className={`absolute ${
              isTablet
                ? 'h-[46px] w-[80px]'
                : 'h-[78.82px] w-[140px] max-[1400px]:h-[61px] max-[1400px]:w-[107px]'
            } bottom-[-30%] left-[5%] rotate-[-8deg] rounded-lg lg:bottom-[-20%]`}
          >
            <img src={randomImage1} alt="" className="animate-scale rounded-lg" />
            <img
              src={starInspiration}
              alt=""
              className="absolute right-[-4%] top-[-20%] size-2.5"
            />
          </div>
        </CSSTransition>
        <img src={starInspiration} alt="" className="absolute left-[50%] top-0 size-3" />
      </div>
      <InspirationCard isMobile={isMobile} onSeeIntroduction={handleSeeIntroduction} />
      <InspirationArticles />
    </div>
  );
};

export default Inspiration;
