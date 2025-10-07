import parse from 'html-react-parser';
import { newSlideVariations } from '@/helpers/constants/slide-variations.const';
import { ISlide, SlideTypes } from '@/interfaces/ISlides';
import Trash from '@/assets/trash-red.svg?react';
import Dice from '@/assets/dice.svg?react';
import Layout from '@/assets/change-layout.svg?react';
import { useContext, useRef, useState } from 'react';
import { IOutlineActions } from '../interfaces/IOutlineActions';
import OutlineActions from './OutlineActions';
import LayoutSelector from './LayoutSelector';
import PresentationService from '@/api/presentationService';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import Loader from '@/assets/loader.svg?react';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import Plus from '@/assets/plus-sign.svg?react';
import { cn } from '@/lib/utils';
import { getPreview } from '@/helpers/utils/preview';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';

interface IProps {
  outline: ISlide;
  onChangeText: (val: string) => void;
  onUpdateLayout: (val: ISlide) => void;
  onDelete: () => void;
  onAddNew: () => void;
  onReroll: (val: ISlide) => void;
  mobile?: boolean;
  index: number;
  moveSlide: (di: number, hi: number) => void;
}

const OutlineSlideItem = ({
  outline,
  onChangeText,
  onUpdateLayout,
  onDelete,
  onReroll,
  mobile,
  index,
  moveSlide,
  onAddNew,
}: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { promptContext, prompt } = useContext(PromptPageContext);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const slideVariations = newSlideVariations[outline.slideType];
  const variation =
    slideVariations?.find((v) => v.name === outline.variation) ?? slideVariations?.[0];

  const handleSelectLayout = (type: string, variant: string) => {
    const newOutline: ISlide = {
      ...outline,
      slideType: type as SlideTypes,
      variation: variant,
    };

    onUpdateLayout(newOutline);
  };

  const handleMenuClick = (id: string) => {
    actions?.find((i) => i.id === id)?.function();
    setDropdownOpen(false);
  };

  const handleReroll = async () => {
    setLoading(true);

    const newOutline = await PresentationService.rerollOneOutline(
      outline.description ?? '',
      prompt,
      promptContext,
    );

    if (newOutline) {
      onReroll(newOutline);
    }

    setLoading(false);
  };

  const actions: IOutlineActions[] = [
    {
      id: 'layout',
      titleKey: 'changeLayout',
      icon: <Layout />,
      hideOnMobile: true,
      function: () => {
        setOpen(!open);
      },
      hidden: outline.slideType === 'title-slide'
    },
    {
      id: 'reroll',
      titleKey: 'reRollLayout',
      icon: <Dice />,
      function: () => {
        handleReroll();
      },
      hidden: outline.slideType === 'title-slide'
    },
    {
      id: 'add',
      titleKey: 'addSlideAfter',
      icon: <Plus />,
      function: () => {
        onAddNew();
      },
    },
    {
      id: 'remove',
      titleKey: 'delete',
      icon: <Trash />,
      function: () => {
        setShowConfirmation(!showConfirmation);
      },
    },
  ];

  const [, drop] = useDrop({
    accept: 'SLIDE',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index - 1;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset() ?? { x: 0, y: 0 };
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSlide?.(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'SLIDE',
    item: { type: 'SLIDE', id: outline.id, index: index - 1 },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  if (loading) {
    return (
      <div
        className={`bg-grey ${
          mobile ? 'me-4 w-full' : 'w-auto'
        } flex min-h-[110px] items-center justify-center rounded-lg`}
      >
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (mobile) {
    return (
      <>
        <div
          className={`flex w-full gap-3 transition-all ${isDragging ? 'opacity-50' : 'opacity-1'}`}
          ref={ref}
        >
          <div className="items-top relative flex w-full gap-2">
            <div className="qspect-square mt-3 flex size-5 items-center justify-center rounded-full bg-[#111111] p-2">
              {index && <p className="text-[12px] font-semibold text-white">{index}</p>}
            </div>
            <textarea
              rows={3}
              value={outline.description}
              onChange={(e) => onChangeText(e.target.value)}
              className="w-full resize-none rounded-lg p-2 outline outline-0 outline-grey/25"
            />
            {!isDragging && (
              <OutlineActions
                actions={actions}
                onClickItem={handleMenuClick}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
              />
            )}
          </div>
        </div>

        <DeleteConfirmationModal
          open={showConfirmation}
          onOpenChange={() => setShowConfirmation(!showConfirmation)}
          onAction={onDelete}
          title={`${t('deleteSlide')}?`}
          description={t('deleteSlideDescription')}
        />
      </>
    );
  }

  return (
    <>
      <div className={`w-auto transition-all ${isDragging ? 'opacity-50' : 'opacity-1'}`}>
        <div ref={ref}>{variation?.preview && parse(getPreview(variation?.preview))}</div>
        <div className="items-top relative flex gap-1">
          <div
            className={cn(
              'rounded-full bg-[#111111] p-2 qspect-square size-5 flex items-center justify-center mt-5',
              {
                'opacity-0': isDragging,
              },
            )}
          >
            {index && <p className="text-[12px] font-bold text-white">{index}</p>}
          </div>
          <textarea
            rows={3}
            value={outline.description}
            onChange={(e) => onChangeText(e.target.value)}
            className="mr-2 mt-3 w-[85%] text-darkText text-[14px] resize-none leading-5 rounded-lg p-2 pr-0 outline outline-0 outline-grey/25 focus:outline-1"
          />
          <OutlineActions
            actions={actions}
            onClickItem={handleMenuClick}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />
        </div>
      </div>

      <LayoutSelector
        open={open}
        onOpenChange={() => setOpen(!open)}
        onSelect={handleSelectLayout}
        outline={outline}
      />

      <DeleteConfirmationModal
        open={showConfirmation}
        onOpenChange={() => setShowConfirmation(!showConfirmation)}
        onAction={onDelete}
        title={`${t('deleteSlide')}?`}
        description={t('deleteSlideDescription')}
      />
    </>
  );
};

export default OutlineSlideItem;
