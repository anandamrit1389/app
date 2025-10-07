import { useTranslation } from 'react-i18next';
import EmptyState from '@/assets/empty-state.svg?react';
import AiStars from '@/assets/ai-stars-1.svg?react';
import Plane from '@/assets/plane.svg?react';
import Clock from '@/assets/clock.svg?react';
import Loader from '@/assets/loader-color.svg?react';
import InabitIcon from '@/assets/logo-inabit-black.svg?react';
import ChevronDown from '@/assets/chevron-down.svg?react';
import Divider from '@/components/CustomUI/Divider/Divider';
import { Input } from '@/components/ui/input';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PresentationContext } from '@/contexts/Presentation.context';
import PresentationService from '@/api/presentationService';
import SlideService from '@/api/slideService';
import { toast } from 'sonner';
import CreditCost from '@/components/CreditCost/CreditCost';
import { CreditAction } from '@/interfaces/IPricing';
import CoinFilled from '@/assets/coin-filled.svg?react';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';

interface SpeakerNoteAITabProps {
  onOpenChange: () => void;
}

const SpeakerNoteAITab = ({ onOpenChange }: SpeakerNoteAITabProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('translation', { keyPrefix: 'speaker' });
  const { activeSlide, presentation, handleUpdateSlide, setActiveSlide } =
    useContext(PresentationContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>(t('defaultPrompt'));
  const [estimate, setEstimate] = useState<number>(0.25);
  const [speakerNote, setSpeakerNote] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);

    if (activeSlide) {
      const response = await PresentationService.generateSpeakerNotes(
        promptInput,
        activeSlide,
        estimate.toString(),
      );

      setSpeakerNote(response);
    }

    setLoading(false);
  };

  const applySpeakerNotes = async (notes: string) => {
    if (activeSlide) {
      try {
        setLoading(true);

        const { data } = await SlideService.updateSlideNotes(activeSlide.id, notes);

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

  const handleShorterText = async () => {
    setLoading(true);

    if (activeSlide && activeSlide.speakerNotes) {
      const data = await PresentationService.generateNewText(
        activeSlide?.speakerNotes,
        'makeShorter',
      );

      if (data) {
        setSpeakerNote(data);
      }
    }

    setLoading(false);
  };

  const paragraphs = speakerNote.split('\n').filter((paragraph) => paragraph.trim() !== '');
  const activeParagraphs = activeSlide?.speakerNotes
    ?.split('\n')
    .filter((paragraph) => paragraph.trim() !== '');

  return (
    <>
      <div className="max-h-[700px] overflow-auto px-8 pt-8">
        {loading && (
          <div className="absolute left-0 top-0 flex size-full items-center justify-center rounded-lg bg-lightGrey/50">
            <Loader className="size-16 animate-spin" />
          </div>
        )}

        <h3 className="mb-2 text-[24px] font-bold text-darkHeadline">{t('header')}</h3>
        <p className="text-darkText">{t('subheader')}</p>

        {!speakerNote && !activeSlide?.speakerNotes && (
          <div className="flex justify-center py-20">
            <EmptyState />
          </div>
        )}

        {activeSlide?.speakerNotes && (
          <div className="mb-6 flex flex-col">
            <div className="mt-6 flex gap-2">
              <div className="w-fit">
                <InabitIcon className="size-8 rounded p-2 outline outline-1 outline-lightGreyPress" />
              </div>
              <div>
                {activeParagraphs?.map((paragraph, index) => (
                  <p className="mb-3" key={index}>
                    {paragraph}
                  </p>
                ))}
                <BaseButton
                  size="sm"
                  variant="outline"
                  disabled={!speakerNote.length || activeSlide?.speakerNotes === speakerNote}
                  onClick={() => applySpeakerNotes(activeSlide?.speakerNotes || speakerNote || '')}
                >
                  {t('apply')}
                </BaseButton>
              </div>
            </div>
            <BaseButton
              classNames="ml-auto"
              variant="secondary"
              onClick={handleShorterText}
              disabled={!!speakerNote}
            >
              {t('shorter')}
              <CreditCost
                action={CreditAction.ADJUST_TEXT}
                icon={<CoinFilled />}
                containerClassName={`border-l border-l-darkText/30`}
                costClassName={`text-darkText`}
              />
            </BaseButton>
          </div>
        )}
        {speakerNote && (
          <div className="my-6 flex gap-2">
            <div className="w-fit">
              <InabitIcon className="size-8 rounded p-2 outline outline-1 outline-lightGreyPress" />
            </div>
            <div>
              {paragraphs.map((paragraph, index) => (
                <p className="mb-3" key={index}>
                  {paragraph}
                </p>
              ))}
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => applySpeakerNotes(speakerNote)}
                disabled={!speakerNote.length || activeSlide?.speakerNotes === speakerNote}
              >
                {t('apply')}
              </BaseButton>
            </div>
          </div>
        )}
      </div>

      <Divider />

      <div className="flex gap-2 p-4">
        <PromptInput
          promptInput={promptInput}
          setPromptInput={setPromptInput}
          onGenerate={handleGenerate}
        />
        <TimeSelector estimate={estimate} setEstimate={setEstimate} />
      </div>
    </>
  );
};

export default SpeakerNoteAITab;

const PromptInput = ({
  promptInput,
  setPromptInput,
  onGenerate,
}: {
  promptInput: string;
  setPromptInput: (val: string) => void;
  onGenerate: () => void;
}) => {
  return (
    <div className="flex w-full items-center rounded-full bg-white p-1 ps-2 outline outline-1 outline-black/10">
      <AiStars className="w-10" />
      <Input
        className="rounded-none border-0 text-lightText outline-none outline-0 focus-visible:ring-0"
        value={promptInput}
        onChange={(e) => setPromptInput(e.target.value)}
      />
      <div className="h-8 border-l border-l-lightGrey"></div>
      <BaseButton
        variant="default"
        classNames="p-3 rounded-full"
        disabled={!promptInput.trim()}
        onClick={onGenerate}
      >
        <CreditCost
          action={CreditAction.ADJUST_TEXT}
          icon={<CoinFilledWhite />}
          containerClassName={`border-r border-r-lightGrey`}
          costClassName={`text-lightGrey`}
        />
        <Plane className="size-4" />
      </BaseButton>
    </div>
  );
};

const TimeSelector = ({
  estimate,
  setEstimate,
}: {
  estimate: number;
  setEstimate: (val: number) => void;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'speaker' });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex h-full w-fit items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium outline outline-1 outline-black/10 whitespace-nowrap">
          <Clock />
          {estimate < 1 ? `${estimate * 60} ${t('seconds')}` : `${estimate} ${t('minute')}`}
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit px-4 py-3">
        <DropdownMenuRadioGroup
          value={estimate.toString()}
          onValueChange={(val) => setEstimate(Number(val))}
          className="flex flex-col gap-1"
        >
          {options.map((duration) => (
            <DropdownMenuRadioItem
              className="hover:bg-lightGrey"
              value={duration.toString()}
              key={duration}
            >
              <div>
                <p className="mb-1">
                  {duration < 1 ? `${duration * 60} ${t('seconds')}` : `${duration} ${t('minute')}`}
                </p>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const options = [0.25, 0.5, 1, 2, 3, 5];
