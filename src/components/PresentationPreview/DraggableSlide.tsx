import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PresentationPreviewActions from './PresentationPreviewActions';
import { ISlide } from '@/interfaces/ISlides';

interface IProps {
  slide: ISlide;
  index: number;
  moveSlide: (di: number, hi: number) => void;
  onAddSlide?: () => void;
  onClick?: (slide: ISlide) => void;
  mobile?: boolean;
}

const DraggableSlide = ({ slide, index, moveSlide, onAddSlide, mobile, onClick }: IProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'SLIDE',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset() ?? { x: 0, y: 0 };

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSlide(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'SLIDE',
    item: { type: 'SLIDE', id: slide.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-pointer"
      onClick={() => {
        if (mobile) {
          onClick?.(slide);
        }
      }}
    >
      <PresentationPreviewActions index={index} slide={slide} onAddSlide={() => onAddSlide?.()} />
    </div>
  );
};

export default DraggableSlide;
