import { useCallback, useEffect, useContext, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination, EffectFade } from 'swiper/modules';
import { PresentationContext } from '@/contexts/Presentation.context';
import Slide from '@/components/PresentationEditor/Slide/Slide';
import { useTranslation } from 'react-i18next';
import MobileSlide from '@/components/PresentationEditor/Slide/Mobile/MobileSlide';
import TTS from '../TTS/TTS';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-creative';
import ArrowLeft from '@/assets/arrowleft.svg';
import ArrowRight from '@/assets/arrowright.svg';
import Exit from '@/assets/exit.svg';
import ExitLight from '@/assets/exitlight.svg';
import { themeCatalog } from '@/helpers/constants/themes.const';
import useMobile from '@/hooks/useMobile';
import ArrowLeftLight from '@/assets/arrow-left-light.svg';
import ArrowRightLight from '@/assets/arrow-right-light.svg';
import ErrorToogle from '@/assets/error-toogle.svg';
import ErrorToogleLight from '@/assets/error-toogle-light.svg';
import Cross from '@/assets/cross.svg';
import CrossLight from '@/assets/cross-light.svg';
import Hide from '@/components/services/Hide';

const AUTO_PLAY_DELAY = 3000;

const SwiperView = ({ mobile }: { mobile?: boolean }) => {
  const {
    presentation,
    present,
    voices,
    currentAudio,
    handleUpdateCurrentAudio,
    filterSkippedSlides,
    slideTransition,
    activeSlide,
    theme,
  } = useContext(PresentationContext);

  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];
  const isDark = currentTheme?.templates.includes('dark');
  const filteredSlides = filterSkippedSlides(presentation?.slides);
  const currentPage = filteredSlides.findIndex(
    (slide) => activeSlide?.slideNumber === slide.slideNumber,
  );
  const pageIndex = currentPage === -1 ? 0 : currentPage;

  const isMobile = useMobile();

  const {
    t,
    i18n: { language },
  } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(pageIndex);
  const [showMenu, setShowMenu] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isErrorVisible, setErrorVisible] = useState(false);
  const swiperRef = useRef<SwiperRef | null>(null);
  const menuTimerRef = useRef<NodeJS.Timeout>();
  const clickTimerRef = useRef<NodeJS.Timeout>();
  const [isUserSwipe, setIsUserSwipe] = useState(false);
  const [isUserMouseWheel, setIsUserMouseWheel] = useState(false);

  const moveToNextSlide = () => {
    if (swiperRef.current && currentSlideIndex < (filteredSlides?.length ?? 0)) {
      setIsUserSwipe(false);
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
      swiperRef.current.swiper.slideTo(currentSlideIndex + 1);
      setIsAutoPlaying(true);
    }
  };

  const moveToFirstSlide = () => {
    if (swiperRef.current) {
      setCurrentSlideIndex(0);
      swiperRef.current.swiper.slideTo(0);
    }
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const slides = useMemo(() => {
    return filterSkippedSlides(presentation?.slides);
  }, [presentation?.slides, filterSkippedSlides]);

  const moveSlide = useCallback(
    (direction: 'next' | 'prev') => {
      if (!swiperRef.current) return;

      if (isAutoPlaying) {
        setErrorVisible(true);
        return;
      }

      const totalSlides = filteredSlides?.length ?? 0;

      if (direction === 'next' && currentSlideIndex < totalSlides - 1) {
        const nextIndex = currentSlideIndex + 1;
        setCurrentSlideIndex(nextIndex);
        swiperRef.current.swiper.slideTo(nextIndex);
      } else if (direction === 'prev' && currentSlideIndex > 0) {
        const prevIndex = currentSlideIndex - 1;
        setCurrentSlideIndex(prevIndex);
        swiperRef.current.swiper.slideTo(prevIndex);
      }
    },
    [currentSlideIndex, filteredSlides, isAutoPlaying],
  );

  const handleMouseMove = () => {
    if (isAutoPlaying) return;
    setShowMenu(true);

    if (menuTimerRef.current) {
      clearTimeout(menuTimerRef.current);
    }

    menuTimerRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 3000);
  };

  const handleMouseClick = (e: MouseEvent) => {
    if (!swiperRef.current) return;
    if (e.button === 2) {
      moveSlide('next');
      e.preventDefault();
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mobile) return;
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return;
    }

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      moveSlide('prev');
      e.preventDefault();
    }, 10);
  };

  const handleErrorClick = () => {
    setErrorVisible(false);
    setShowMenu(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      const nextKeys = ['ArrowRight', 'ArrowDown'];
      const prevKeys = ['ArrowLeft', 'ArrowUp'];

      if (nextKeys.includes(e.key)) {
        moveSlide('next');
      } else if (prevKeys.includes(e.key)) {
        moveSlide('prev');
      }
    },
    [moveSlide],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('mousedown', handleMouseClick);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('mousedown', handleMouseClick);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isAutoPlaying && currentSlideIndex < (slides?.length ?? 0) - 1) {
      timeoutId = setTimeout(() => {
        moveToNextSlide();
      }, AUTO_PLAY_DELAY);
    } else if (isAutoPlaying && currentSlideIndex >= (slides?.length ?? 0) - 1) {
      setIsAutoPlaying(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAutoPlaying, currentSlideIndex, slides?.length]);

  useEffect(() => {
    if (!isMobile) return;

    let timeout: NodeJS.Timeout;

    const handleTouchStart = () => {
      setShowMenu(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowMenu(false), 5000);
    };

    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div onMouseMove={handleMouseMove} onClick={handleLeftClick}>
      <Swiper
        key={`${slideTransition}-${isAutoPlaying}`}
        ref={swiperRef}
        navigation
        direction={
          mobile ? 'horizontal' : slideTransition === 'slide-right' ? 'horizontal' : 'vertical'
        }
        initialSlide={currentSlideIndex}
        slidesPerView={1}
        onTouchStart={() => setIsUserSwipe(true)}
        onSlideChange={(swiper) => {
          if (isAutoPlaying && (isUserSwipe || isUserMouseWheel)) {
            setErrorVisible(true);
            return;
          }
          setCurrentSlideIndex(swiper.activeIndex);
          setIsAutoPlaying(false);
        }}
        onWheel={() => setIsUserMouseWheel(true)}
        mousewheel={!isAutoPlaying}
        allowTouchMove={!isAutoPlaying}
        observeParents={true}
        observer={true}
        keyboard={{
          enabled: false,
        }}
        modules={[Mousewheel, Pagination, EffectFade]}
        effect={slideTransition === 'fade' ? 'fade' : 'cards'}
        speed={slideTransition === 'none' ? 0 : 500}
      >
        {slides
          ?.filter((s) => !s.skipSlide)
          ?.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              {mobile ? (
                <MobileSlide
                  slide={slide}
                  index={index}
                  presentationModeSlideIndex={currentSlideIndex}
                />
              ) : (
                <Slide slide={slide} index={index} presentationModeSlideIndex={currentSlideIndex} />
              )}
            </SwiperSlide>
          ))}
      </Swiper>

      {showMenu && isMobile && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          } z-30 flex items-center gap-8 rounded-full px-5 py-3`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <button
              className="flex size-8 items-center justify-center hover:opacity-75"
              onClick={() => moveSlide('prev')}
            >
              <img src={isDark ? ArrowLeftLight : ArrowLeft} alt="Arrow Left" className="size-8" />
            </button>
            <button
              className="flex size-8 items-center justify-center hover:opacity-75"
              onClick={() => moveSlide('next')}
            >
              <img
                src={isDark ? ArrowRightLight : ArrowRight}
                alt="Arrow Right"
                className="size-8"
              />
            </button>
          </div>

          {presentation && (
            <Hide environments={['prod']}>
              <TTS
                presentation={presentation}
                currentSlideIndex={currentSlideIndex}
                isAutoPlaying={isAutoPlaying}
                language={language}
                voices={voices}
                currentAudio={currentAudio}
                moveToNextSlide={moveToNextSlide}
                stopAutoPlay={stopAutoPlay}
                moveToFirstSlide={moveToFirstSlide}
                handleUpdateCurrentAudio={handleUpdateCurrentAudio}
                isDark={isDark}
              />
            </Hide>
          )}

          <div
            className="flex size-8 cursor-pointer items-center justify-center hover:opacity-75"
            onClick={present}
          >
            <img src={isDark ? ExitLight : Exit} alt="Exit" className="size-8" />
          </div>
        </div>
      )}

      {showMenu && !isMobile && (
        <div
          className={`min-w-md fixed bottom-5 left-1/2 -translate-x-1/2 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          } z-30 flex items-center gap-4 rounded-full px-5 py-3 lg:gap-8`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <button
              className="flex size-8 items-center justify-center hover:opacity-75"
              onClick={() => moveSlide('prev')}
            >
              <img src={isDark ? ArrowLeftLight : ArrowLeft} alt="Arrow Left" className="size-8" />
            </button>
            <div className="flex items-center justify-center gap-0.5 text-sm">
              <span className="text-sm">{filteredSlides?.length ? currentSlideIndex + 1 : 0}</span>
              <span className="text-sm"> / </span>
              <span className="text-sm"> {filteredSlides?.length ?? 0}</span>
            </div>
            <button
              className="flex size-8 items-center justify-center hover:opacity-75"
              onClick={() => moveSlide('next')}
            >
              <img
                src={isDark ? ArrowRightLight : ArrowRight}
                alt="Arrow Right"
                className="size-8"
              />
            </button>
          </div>

          {presentation && (
            <Hide environments={['prod']}>
              <TTS
                presentation={presentation}
                currentSlideIndex={currentSlideIndex}
                isAutoPlaying={isAutoPlaying}
                language={language}
                voices={voices}
                currentAudio={currentAudio}
                moveToNextSlide={moveToNextSlide}
                stopAutoPlay={stopAutoPlay}
                moveToFirstSlide={moveToFirstSlide}
                handleUpdateCurrentAudio={handleUpdateCurrentAudio}
                isDark={isDark}
              />
            </Hide>
          )}

          <div
            className="cursor-pointer rounded-md border px-3 py-2 hover:opacity-75"
            onClick={present}
          >
            {t('exitPresentation')}
          </div>
        </div>
      )}

      {isErrorVisible && isAutoPlaying && (
        <div
          className={`${
            isDark ? 'bg-white text-black' : 'bg-[#1C1C1C] text-white'
          } fixed bottom-[10%] right-5 z-50 flex max-w-md items-center justify-between gap-2 rounded-lg p-4`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="cursor-pointer border-none bg-transparent text-2xl text-white"
            onClick={() => setErrorVisible(false)}
          >
            <img src={isDark ? ErrorToogleLight : ErrorToogle} alt="Cross" className="size-8" />
          </button>
          <div className="flex-1 text-sm">
            {t('autoplayToggleMessage1')}{' '}
            <span className="cursor-pointer font-bold underline" onClick={handleErrorClick}>
              {t('autoplayToggleMessage2')}
            </span>
            .
          </div>
          <button
            className="cursor-pointer border-none bg-transparent text-2xl text-white"
            onClick={() => setErrorVisible(false)}
          >
            <img src={isDark ? CrossLight : Cross} alt="Cross" className="size-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SwiperView;
