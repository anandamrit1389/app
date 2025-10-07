import SlideService from '@/api/slideService';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Textarea } from '@/components/ui/textarea';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoaderDark from '@/assets/loader-dark.svg?react';

interface SpeakerNoteCustomTabProps {
  onOpenChange: () => void;
}

const SpeakerNoteCustomTab = ({ onOpenChange }: SpeakerNoteCustomTabProps) => {
  const { activeSlide, presentation, handleUpdateSlide, setActiveSlide } =
    useContext(PresentationContext);
  const {
    t,
    i18n: { language },
  } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [notes, setNotes] = useState(activeSlide?.speakerNotes || '');
  const [loading, setLoading] = useState(false);

  const handleChangeValuee = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleUpdateNotes = async () => {
    if (activeSlide) {
      try {
        setLoading(true);

        const { data } = await SlideService.updateSlide(activeSlide.id, {
          ...activeSlide,
          speakerNotes: notes,
        });

        setActiveSlide(data);

        if (presentation?.voiceId) {
          const { data } = await SlideService.updateSlideAudio(
            activeSlide.id,
            presentation?.voiceId,
            language,
            notes,
          );
          handleUpdateSlide(data);
        } else {
          handleUpdateSlide(data);
        }

        toast.success('You have successfully updated speaker note.');
        onOpenChange();
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong :(');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8">
      <h3 className="mb-2 text-xl font-bold text-darkHeadline md:text-2xl">{t('speakerNotes')}</h3>
      <p className="mb-6 text-sm text-dark">{t('speakerNoteDescription')}</p>
      <Textarea
        value={notes}
        placeholder="Text goes right here"
        className="mb-4 h-[277px] not-italic"
        onChange={handleChangeValuee}
      />
      <BaseButton
        variant="outline"
        classNames="ml-auto"
        onClick={handleUpdateNotes}
        disabled={!notes.length || activeSlide?.speakerNotes === notes}
        loading={loading}
        loader={
          <div className="animate-spin">
            <LoaderDark />
          </div>
        }
      >
        {t('customSpeakerNoteButton')}
      </BaseButton>
    </div>
  );
};

export default SpeakerNoteCustomTab;
