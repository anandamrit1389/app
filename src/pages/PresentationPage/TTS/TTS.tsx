import { useContext, useEffect, useRef, useState } from 'react';
import { IPresentation } from '@/interfaces/ISlides';
import SlideService from '@/api/slideService';
import { getTextFromSlide } from '@/helpers/utils/parsers';
import { toast } from 'sonner';
import { CurrentAudio, IVoice } from '@/interfaces/IUsePresentation';
import { AuthContext } from '@/providers/auth.provider';
import { FeatureKey } from '@/interfaces/IUser';
import useMobile from '@/hooks/useMobile';
import SoundOn from '@/assets/soundon.svg';
import SoundOff from '@/assets/soundoff.svg';
import SoundOnLight from '@/assets/sound-on-light.svg';
import SoundOffLight from '@/assets/sound-off-light.svg';
import { useTranslation } from 'react-i18next';

interface TTSProps {
  presentation: IPresentation;
  currentSlideIndex: number;
  isAutoPlaying: boolean;
  language: string;
  voices: IVoice[];
  currentAudio: CurrentAudio | null;
  moveToNextSlide: () => void;
  stopAutoPlay: () => void;
  handleUpdateCurrentAudio: (audio: CurrentAudio | null) => void;
  moveToFirstSlide: () => void;
  isDark: boolean;
}

const TTS = ({
  presentation,
  currentSlideIndex,
  isAutoPlaying,
  language,
  voices,
  currentAudio,
  handleUpdateCurrentAudio,
  moveToNextSlide,
  stopAutoPlay,
  moveToFirstSlide,
  isDark,
}: TTSProps) => {
  const { featuresAccess } = useContext(AuthContext);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPresentation, setCurrentPresentation] = useState<IPresentation>(presentation);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isLastSlide = currentSlideIndex === currentPresentation.slides.length - 1;
  const voiceId = currentPresentation.voiceId ?? voices[0]?.id;

  const isMobile = useMobile();

  const playAudio = (pres: IPresentation, index?: number) => {
    const currentSlide = pres.slides[index ?? currentSlideIndex];
    if (currentSlide.audio) {
      const audio = audioRef.current;

      if (currentAudio) {
        currentAudio.audio.pause();
      }

      if (audio) {
        audio.src = currentSlide.audio;
        audio.currentTime = currentTime;
        audio.muted = isMuted;
        audio.play();

        setIsPlaying(true);
        handleUpdateCurrentAudio({
          name: currentSlide.audio,
          audio,
        });

        audio.onended = () => {
          setIsPlaying(false);
          moveToNextSlide();
          handleUpdateCurrentAudio(null);

          if (isLastSlide) {
            stopAutoPlay();
          }
        };
      }
    }
  };

  const handlePlay = async () => {
    const currentSlide = currentPresentation.slides[currentSlideIndex];
    playAudio(currentPresentation);

    const isSomeSlideWithoutAudio = currentPresentation.slides.some((slide) => {
      return !slide.audio && getTextFromSlide(slide);
    });

    if (!currentSlide.audio || isSomeSlideWithoutAudio) {
      try {
        const response = await SlideService.updateSlidesAudio(
          currentPresentation.id,
          voiceId,
          language,
        );
        setCurrentPresentation(response.data);
        playAudio(response.data);
      } catch {
        toast.error('Something went wrong :(');
      }
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      audio.pause();
    }
    setIsPlaying(false);
  };

  const playAgain = () => {
    moveToFirstSlide();
    playAudio(presentation, 0);
    setIsPlaying(true);
  };

  const handlePlaybackClick = () => {
    if (isLastSlide) {
      return playAgain();
    }

    if (isAutoPlaying) {
      return pauseAudio();
    }

    return handlePlay();
  };

  useEffect(() => {
    if (isAutoPlaying || isPlaying) {
      handlePlay();
    }
  }, [currentSlideIndex, isAutoPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  return (
    <>
      {featuresAccess[FeatureKey.VOICE_FEATURE].hasAccess && (
        <div
          className={`text-${isDark ? 'black' : 'white'} flex items-center lg:gap-8 ${isMobile ? 'gap-8' : 'gap-4'}`}
        >
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm">{t('autoplay')}</span>
            <div className="relative" onClick={handlePlaybackClick}>
              <input type="checkbox" className="hidden" checked={isAutoPlaying} />
              <div
                className={`block w-10 h-6 rounded-full ${
                  isAutoPlaying ? 'bg-default-gradient' : 'bg-gray-400'
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                  isPlaying ? 'transform translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleMute}>
            <div className="flex items-center gap-2">
              {!isMobile && (
                <div className="flex items-center gap-1 ">
                  <span className="text-sm">{isMuted ? t('soundOff') : t('soundOn')}</span>
                </div>
              )}
              <div
                className={` w-8 h-8 items-center justify-center flex  ${isMobile ? 'p-1 rounded-full border' : ''}`}
              >
                {isMuted ? (
                  <img src={isDark ? SoundOffLight : SoundOff} alt="Sound Off" className="size-7" />
                ) : (
                  <img src={isDark ? SoundOnLight : SoundOn} alt="Sound On" className="size-7" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} />
    </>
  );
};

export default TTS;
