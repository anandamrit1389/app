import { ISlide } from '@/interfaces/ISlides';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Clone from '@/assets/copy.svg?react';
import Skip from '@/assets/eye-cross.svg?react';
import Trash from '@/assets/trash.svg?react';
import BaseButton from '../CustomUI/BaseButton/BaseButton';
import SlidePreview from '../PresentationEditor/Slide/SlidePreview';
import { useTranslation } from 'react-i18next';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import useMobile from '@/hooks/useMobile';

interface IProps {
  slide: ISlide;
  onAddSlide: () => void;
  index: number;
}

const PresentationPreviewActions = ({ slide, onAddSlide, index }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isMobile = useMobile();
  const { cloneSlide, deleteSlide, activeSlide, skipSlide, readonly } =
    useContext(PresentationContext);

  const isRestrictedSlide = useMemo(() => {
    const restrictedTypes = ['content-slide', 'closing-slide'];
    return restrictedTypes.includes(slide.slideType);
  }, [slide.slideType]);

  return (
    <>
      <ContextMenu modal={false}>
        <ContextMenuTrigger>
          {isMobile ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <SlidePreview slide={slide} mobile />
              <p
                className={`pt-1 text-[12px] font-medium text-tertiaryText ${
                  activeSlide?.id === slide.id ? 'text-redHover' : 'text-greyText'
                }`}
              >
                {t('slide')} {index + 1}
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <p className="pt-2 text-[14px] font-medium">{index + 1}</p>
              <SlidePreview slide={slide} />
            </div>
          )}
        </ContextMenuTrigger>

        {!readonly && (
          <ContextMenuContent>
            <ContextMenuItem className="p-0">
              <BaseButton
                variant="ghost"
                classNames="w-full justify-start p-2"
                onClick={onAddSlide}
              >
                <Plus className="me-2" /> {t('add')}
              </BaseButton>
            </ContextMenuItem>
            {!isRestrictedSlide && (
              <ContextMenuItem className="p-0">
                <BaseButton
                  variant="ghost"
                  classNames="w-full justify-start p-2"
                  onClick={() => cloneSlide(slide.id)}
                  shortcut="Ctrl+D"
                >
                  <Clone className="me-2" /> {t('clone')}
                </BaseButton>
              </ContextMenuItem>
            )}
            <ContextMenuItem className="p-0">
              <BaseButton
                variant="ghost"
                classNames="w-full justify-start p-2"
                onClick={() => skipSlide(slide.id)}
              >
                <Skip className="me-2" /> {slide.skipSlide ? t('show') : t('skip')}
              </BaseButton>
            </ContextMenuItem>
            {!isRestrictedSlide && (
              <ContextMenuItem className="p-0">
                <BaseButton
                  variant="ghost"
                  classNames="w-full justify-start p-2"
                  onClick={() => deleteSlide(slide.id)}
                >
                  <Trash className="me-2 w-6" /> {t('delete')}
                </BaseButton>
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        )}
      </ContextMenu>
    </>
  );
};

export default PresentationPreviewActions;
