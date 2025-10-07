import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { PresentationContext } from '@/contexts/Presentation.context';
import { IContent } from '@/interfaces/ISlides';
import ChevronLeft from '@/assets/chevron-left.svg?react';
import ChevronRight from '@/assets/chevron-right.svg?react';
import Trash from '@/assets/trash.svg?react';
import Split from '@/assets/Vector.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import Plus from '@/assets/plus-sign.svg?react';
import Dice from '@/assets/dice.svg?react';
import { toast } from 'sonner';
import presentationService from '@/api/presentationService';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';

interface IProps {
  totalCount: number;
  index: number;
  card: IContent;
  slideId: string;
  listActions?: boolean;
  agendaActions?: boolean;
}

const CardActions = ({ index, totalCount, card, slideId, listActions, agendaActions }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const {
    presentation,
    deleteItem,
    moveItem,
    splitContentAsImportant,
    updateSlide,
    handleUndoAction,
    updateContent,
  } = useContext(PresentationContext);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const rerollCard = async (id: string) => {
    if (presentation) {
      const slides = [...presentation.slides];

      let itemToReroll: IContent | null = null;
      let slideToUpdate = slides[0];

      slides.forEach((slide) => {
        const content = slide.content?.find((content) => content.id === id);

        if (content) {
          itemToReroll = content;
          slideToUpdate = slide;
        }
      });

      updateSlide({
        ...slideToUpdate,
        content: slideToUpdate.content?.map((content) => {
          return content.id !== id ? content : { ...content, image: null };
        }),
      });

      if (itemToReroll !== null) {
        const res = await presentationService.generateNewCard(
          slideToUpdate,
          presentation.translatedLanguages,
          itemToReroll,
          listActions ? undefined : presentation.imageStyle,
        );

        if (!res) {
          toast.error(t('errorContentGenerationMessage'), {
            description: t('errorContentGenerationDescriptionMessage'),
          });

          return;
        }

        const newContent: IContent = itemToReroll;
        newContent.image = res.image;
        newContent.imageKey = res.imageKey;
        newContent.text = res.text;
        newContent.textTranslations = res.textTranslations || {};
        newContent.title = res.title;
        newContent.titleTranslations = res.titleTranslations || {};
        newContent.subtitle = res.subtitle;
        newContent.subtitleTranslations = res.subtitleTranslations || {};

        // updateSlide({
        //   ...slideToUpdate,
        //   content: slideToUpdate.content?.map((content) => {
        //     return content.id !== id ? content : newContent;
        //   }),
        // });

        updateContent(newContent, slideId);

        toast(t('cardChangeInfo'), {
          action: {
            label: t('cardUndo'),
            onClick: () => handleUndoAction(),
          },
        });
      }
    }
  };

  const addCard = async (id: string) => {
    if (presentation) {
      const slides = [...presentation.slides];
      const slide = slides.find((s) => s.id === id);

      if (slide) {
        const newContent: IContent = {
          id: uuidv4(),
          contentType: 'card',
          sortOrder: slide.content?.length + 1,
          image: null,
          subtitleTranslations: {},
          titleTranslations: {},
          textTranslations: {},
        };

        updateSlide({
          ...slide,
          content: [...slide.content, newContent],
        });

        const theme = presentation.themeId === 'light' ? 'light' : 'dark';

        newContent.text = 'description';
        newContent.title = 'headline';
        newContent.image = `${window.origin}/images/title-${theme}.png`;

        updateContent(newContent, slideId);

        toast(t('newCardAdded'), {
          action: {
            label: t('cardUndo'),
            onClick: () => handleUndoAction(),
          },
        });   
      }
    }
  };

  return (
    <>
      <div className="flex gap-x-1 rounded-lg bg-white p-1 shadow-3xl">
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => moveItem(card.id)}
          disabled={index === 0}
          classNames="size-8"
          tooltip={t('move')}
        >
          <ChevronLeft className="size-[12px]" />
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => moveItem(card.id, true)}
          disabled={index + 1 === totalCount}
          classNames="size-8"
          tooltip={t('move')}
        >
          <ChevronRight className="size-[12px]" />
        </BaseButton>
        {!listActions && totalCount > 1 && !agendaActions && (
          <BaseButton
            variant="ghost"
            size="icon"
            onClick={() => splitContentAsImportant(card.id)}
            classNames="size-8 mx-3"
            tooltip={t('breakOut')}
          >
            <Split className="size-[18px]" />
          </BaseButton>
        )}
        {!agendaActions && (
          <BaseButton
            variant="ghost"
            size="icon"
            onClick={() => addCard(slideId)}
            classNames="size-8 me-3"
            tooltip={t('add')}
          >
            <Plus className="size-[18px]" />
          </BaseButton>
        )}
        {!listActions && !agendaActions && (
          <BaseButton
            variant="ghost"
            size="icon"
            onClick={() => rerollCard(card.id)}
            classNames="size-8 me-3"
            tooltip={t('reRollContent')}
          >
            <Dice className="size-[18px]" />
          </BaseButton>
        )}
        {!agendaActions && (
          <BaseButton
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmation(!showConfirmation)}
            classNames="size-8"
            tooltip={t('delete')}
          >
            <Trash className="size-[18px]" />
          </BaseButton>
        )}
      </div>
      <DeleteConfirmationModal
        title={t('deleteModalTitle')}
        description={t('deleteModalDescription')}
        open={showConfirmation}
        onOpenChange={() => setShowConfirmation(!showConfirmation)}
        onAction={() => deleteItem(card.id)}
      />
    </>
  );
};

export default CardActions;
