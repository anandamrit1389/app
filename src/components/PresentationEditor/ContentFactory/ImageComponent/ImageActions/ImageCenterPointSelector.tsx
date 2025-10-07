import { ImageFit, ISlide, ITemplate } from '@/interfaces/ISlides';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import EmptyImage from '../EmptyImage';

interface IProps {
  focusPointX: number;
  focusPointY: number;
  onUpdate: (x: number, y: number) => void;
  imgSrc: string | undefined;
  animatePulse: boolean;
  aspectRatio?: number | null;
  handleChangeIsCropping: (val: boolean) => void;
  scale: number;
  isCropping: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  loading?: boolean;
  slide?: ISlide;
  isPreview?: boolean;
  template?: ITemplate;
  ignorePadding?: boolean;
  theme?: string;
  imageFit?: ImageFit;
}

const ImageCenterPointSelector = ({
  onUpdate,
  focusPointX,
  focusPointY,
  imgSrc,
  animatePulse,
  aspectRatio,
  handleChangeIsCropping,
  scale,
  isCropping,
  onClick,
  loading,
  slide,
  isPreview,
  template,
  ignorePadding,
  theme,
  imageFit,
}: IProps) => {
  const sliderAreaRef = useRef<HTMLDivElement>(null);
  const initialPointerPos = useRef({ x: 0, y: 0 });
  const initialFocusPoint = useRef({ x: 0, y: 0 });

  const [noImage, setNoImage] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (sliderAreaRef.current) {
      const rect = sliderAreaRef.current.getBoundingClientRect();

      const deltaX = ((clientX - initialPointerPos.current.x) / rect.width) * 100;
      const deltaY = ((clientY - initialPointerPos.current.y) / rect.height) * 100;

      let x = initialFocusPoint.current.x - deltaX;
      let y = initialFocusPoint.current.y - deltaY;

      x = Math.round(Math.max(0, Math.min(100, x)));
      y = Math.round(Math.max(0, Math.min(100, y)));
      onUpdate?.(x, y);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCropping) return;

    const target = e.target as HTMLElement;
    if (!target.id) return;

    initialPointerPos.current = { x: e.clientX, y: e.clientY };
    initialFocusPoint.current = { x: focusPointX, y: focusPointY };

    const moveHandler = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      handleChangeIsCropping(false);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isCropping) return;

    initialPointerPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    initialFocusPoint.current = { x: focusPointX, y: focusPointY };

    const moveHandler = (e: TouchEvent) => {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const upHandler = () => {
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
      handleChangeIsCropping(false);
    };

    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', upHandler);
  };

  return (
    <div
      ref={sliderAreaRef}
      className={cn('relative h-full w-full user-select-none', {
        'cursor-move': isCropping,
        rounded: !template?.roundingSize,
      })}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ userSelect: 'none', touchAction: 'none' }}
    >
      <div className="relative size-full">
        {(noImage || !imageLoaded) && (
          <EmptyImage
            loading={loading}
            theme={theme || 'grey'}
            slide={slide}
            isPreview={isPreview}
          />
        )}

        {imgSrc && imageFit === 'contain' && (
          <img
            src={imgSrc}
            className="absolute inset-0 size-full object-cover blur-3xl"
            draggable={false}
          />
        )}

        {imgSrc && (
          <img
            crossOrigin="anonymous"
            id={imgSrc}
            src={imgSrc}
            key={imgSrc}
            className={cn(
              `size-full object-cover ${template?.roundingSize && `${template.roundingSize}`}`,
              {
                'animate-pulse': animatePulse,
                'p-4': template?.roundingSize && !ignorePadding,
              },
            )}
            onDragStart={(e) => e.preventDefault()}
            onLoad={() => {
              setNoImage(false);
              setImageLoaded(true);
            }}
            onError={() => {
              setNoImage(true);
              setImageLoaded(false);
            }}
            style={{
              display: imageLoaded ? 'block' : 'none',
              objectPosition: `${focusPointX}% ${focusPointY}%`,
              aspectRatio: aspectRatio ?? 'auto',
              transform: `scale(${scale})`,
              transformOrigin: `${focusPointX}% ${focusPointY}%`,
              objectFit: imageFit || 'cover',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageCenterPointSelector;
