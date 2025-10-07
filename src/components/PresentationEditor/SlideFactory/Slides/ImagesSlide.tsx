import { IContent, ISlide } from '@/interfaces/ISlides';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext } from 'react';
import CardComponent from '../../ContentFactory/CardComponent/CardComponent';

const ImagesSlide = ({ slide, isPreview }: { slide: ISlide; isPreview?: boolean }) => {
  const { updateContent, switchToNextElement, currentElement } = useContext(PresentationContext);

  const handleUpdate = (val: IContent) => {
    updateContent?.(val, slide.id);
  };

  if (currentElement && currentElement.slideId === slide.id) {
    switchToNextElement();
  }

  if (slide?.content?.length < 4) {
    return (
      <div className="flex size-full gap-presentation p-presentation">
        {slide?.content?.map((c, index) => (
          <CardComponent
            withoutCaption
            key={c.id + index}
            card={c}
            index={index}
            totalCount={slide.content.length}
            isPreview={isPreview}
            variation={{ type: '', imageClassName: 'size-full' }}
            onUpdateContent={handleUpdate}
            slideId={slide.id}
            ignorePadding
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid size-full grid-cols-8 gap-content p-presentation">
      {slide?.content?.map((c, index) => (
        <div
          key={`${c.id}_${index}`}
          className={`h-imageSlideLineHeight min-h-full w-full bg-grey ${getImageLayout(
            index,
            slide.content?.length,
          )}`}
        >
          <CardComponent
            withoutCaption
            key={c.id}
            card={c}
            index={index}
            totalCount={slide.content.length}
            isPreview={isPreview}
            variation={{
              type: '',
              imageClassName: 'h-imageSlideLineHeight min-h-full',
            }}
            onUpdateContent={handleUpdate}
            slideId={slide.id}
            ignorePadding
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesSlide;

const getImageLayout = (index: number, length: number) => {
  if (length === 4) {
    return index === 0 || index === 3 ? 'col-span-5' : 'col-span-3';
  }

  if (length === 5) {
    return index === 0 || index === 2 ? 'col-span-3' : index === 1 ? 'col-span-2' : 'col-span-4';
  }

  if (length === 6) {
    return index < 4 ? 'col-span-2' : index === 5 ? 'col-span-5' : 'col-span-3';
  }
};
