import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import AIPrompt from '@/assets/ai-stars-1.svg?react';
import SpeakerNoteModal from './SpeakerNoteModal/SpeakerNoteModal';
import { PresentationContext } from '@/contexts/Presentation.context';
import PlayIcon from '@/assets/player-sound.svg?react';
import PauseIcon from '@/assets/player-pause.svg?react';
import EditIcon from '@/assets/edit.svg?react';
import { ISlide } from '@/interfaces/ISlides';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import SlideService from '@/api/slideService';
import { toast } from 'sonner';
import { AuthContext } from '@/providers/auth.provider';
import { DEFAULT_VOICE_ID } from '@/helpers/constants/presentation.const';
import { FeatureKey } from '@/interfaces/IUser';
import Hide from '@/components/services/Hide';

const SlideNotes = () => {
  const {
    presentation,
    activeSlide,
    handleUpdateCurrentAudio,
    currentAudio,
    handleUpdateSlide,
    changeActiveSlide,
    voices,
  } = useContext(PresentationContext);
  const { featuresAccess } = useContext(AuthContext);
  const {
    t,
    i18n: { language },
  } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [isOpenSpeakerNoteModal, setIsOpenSpeakerNoteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notesValue, setNotesValue] = useState(activeSlide?.speakerNotes ?? '');
  const [currentSlide, setCurrentSlide] = useState(activeSlide);
  const [currentAudioPosition, setCurrentAudioPosition] = useState(0);

  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setCurrentSlide(activeSlide);
    setNotesValue(activeSlide?.speakerNotes ?? '');
  }, [activeSlide]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value);
  };

  const handleToggleSpeakerNoteModal = () => {
    setIsOpenSpeakerNoteModal((prev) => !prev);
  };

  const playAudio = (currentSlide: ISlide) => {
    if (currentSlide.audio) {
      if (currentAudio) {
        currentAudio.audio.pause();
      }

      const audio = new Audio(currentSlide.audio);
      audio.currentTime = currentAudioPosition;
      audio.play();

      handleUpdateCurrentAudio({
        name: currentSlide.audio,
        audio,
      });

      audio.onended = () => {
        setCurrentAudioPosition(0);
        handleUpdateCurrentAudio(null);
      };
    }
  };

  const handlePlay = async () => {
    if (currentSlide?.audio) {
      playAudio(currentSlide);
    } else if (activeSlide?.speakerNotes) {
      try {
        setIsLoading(true);

        const { data } = await SlideService.updateSlideAudio(
          activeSlide.id,
          presentation?.voiceId || voices[0]?.id || DEFAULT_VOICE_ID,
          language,
          notesValue || activeSlide?.speakerNotes,
        );

        handleUpdateSlide(data);

        if (data && data.audio) {
          const audio = new Audio(data.audio);
          audio.play();
          setCurrentSlide(data);
          handleUpdateCurrentAudio({
            name: data.audio as string,
            audio,
          });
          audio.onended = () => handleUpdateCurrentAudio(null);
        } else {
          console.error('Invalid audio data received.');
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateNotes = async () => {
    if (activeSlide) {
      try {
        const { data } = await SlideService.updateSlideNotes(activeSlide.id, notesValue);
        changeActiveSlide(data);

        if (presentation?.voiceId) {
          const { data } = await SlideService.updateSlideAudio(
            activeSlide.id,
            presentation?.voiceId || voices[0]?.id || DEFAULT_VOICE_ID,
            language,
            notesValue,
          );
          handleUpdateSlide(data);
        } else {
          handleUpdateSlide(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong :(');
      }
    }
  };

  const handlePause = () => {
    if (currentAudio) {
      setCurrentAudioPosition(currentAudio.audio.currentTime);
      currentAudio.audio.pause();
      handleUpdateCurrentAudio({ audio: currentAudio.audio, name: '' });
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      handleUpdateNotes();
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [notesValue]);

  useEffect(() => {
    return () => {
      handleUpdateCurrentAudio(null);
    };
  }, []);

  return (
    <>
      <AccordionItem value="slideNotes">
        <AccordionTrigger>
          <span className="text-[12px] font-medium uppercase">{t('speakerNotes')}</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="relative flex flex-col gap-2">
            {activeSlide?.speakerNotes ? (
              <>
                <div className="max-h-[288px] overflow-y-auto rounded-lg bg-lightGrey text-sm text-darkText">
                  <Textarea
                    className="p-3 pb-10 not-italic"
                    defaultValue={activeSlide?.speakerNotes}
                    value={notesValue || activeSlide?.speakerNotes}
                    onChange={handleNotesChange}
                  />
                  {featuresAccess[FeatureKey.VOICE_FEATURE].hasAccess && (
                    <Hide environments={['prod']}>
                      {currentAudio?.name === currentSlide?.audio ? (
                        <BaseButton
                          icon={<PauseIcon />}
                          onClick={handlePause}
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          classNames="absolute right-1 bottom-12 hover:bg-transparent active:bg-transparent focus:bg-transparent"
                        />
                      ) : (
                        <BaseButton
                          icon={<PlayIcon />}
                          onClick={handlePlay}
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          classNames="absolute right-1 bottom-12 hover:bg-transparent active:bg-transparent focus:bg-transparent"
                        />
                      )}
                    </Hide>
                  )}
                </div>
                <BaseButton
                  classNames="font-regular w-max mx-auto"
                  icon={<EditIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={handleToggleSpeakerNoteModal}
                >
                  {t('editSpeakerNote')}
                </BaseButton>
              </>
            ) : (
              <BaseButton
                variant="outline"
                icon={<AIPrompt />}
                classNames="py-1.5"
                onClick={handleToggleSpeakerNoteModal}
              >
                {t('addSpeakerNotes')}
              </BaseButton>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      <SpeakerNoteModal open={isOpenSpeakerNoteModal} onOpenChange={handleToggleSpeakerNoteModal} />
    </>
  );
};

export default SlideNotes;
