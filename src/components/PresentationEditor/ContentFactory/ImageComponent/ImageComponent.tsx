import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ImageActions, { IImageAction } from './ImageActions/ImageActions';
import { Button } from '@/components/ui/button';
import { PresentationContext } from '@/contexts/Presentation.context';
import useMobile from '@/hooks/useMobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import ReplaceIcon from '@/assets/replace.svg?react';
import { Replace } from 'lucide-react';
import MoveIcon from '@/assets/move.svg?react';
import Trash from '@/assets/trash.svg?react';
import { ImageAligns, ImageFit } from '@/interfaces/ISlides';
import AlignSheet from './ImageActions/AlignSheet';
import { cn } from '@/lib/utils';
import ImageCenterPointSelector from './ImageActions/ImageCenterPointSelector';
import EmptyImage from './EmptyImage';
import { useTranslation } from 'react-i18next';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import Divider from '@/components/CustomUI/Divider/Divider';
import { Slider } from '@/components/ui/slider';
import { TemplateContext } from '@/contexts/Template.context';
import ImageFitMenu from './ImageActions/ImageFitMenu';
import BorderRadiusSelector from './ImageActions/BorderRadiusSelector';

interface IProps {
  align?: ImageAligns;
  className?: string;
  image?: string;
  isPreview?: boolean;
  isCircular?: boolean;
  onTransform?: (x: number, y: number, scale: number, imageFit: ImageFit) => void;
  slideId?: string;
  contentId?: string;
  onActions?: (val: boolean) => void;
  keywords?: string;
  focusPointX?: number;
  focusPointY?: number;
  imageFit?: ImageFit;
  currentScale?: number;
  ignorePadding?: boolean;
  setBorderRadius?: (id: string, value: string) => void;
}

const ImageComponent = ({
  align = 'object-top',
  image,
  className,
  isPreview,
  isCircular = false,
  onTransform,
  slideId,
  contentId,
  onActions,
  keywords,
  focusPointX,
  focusPointY,
  imageFit,
  currentScale,
  ignorePadding,
  setBorderRadius,
}: IProps) => {
  const isMobile = useMobile();
  const initialScale = currentScale ? currentScale : 1;
  const {
    presentation,
    showSideBar,
    setActiveImage,
    activeImage,
    theme,
    loadingImageContentId,
    loadingImageSlideId,
    presentationTemplateInfo,
    deleteContent,
    activeSlide,
    setTransformOpen,
    setReferenceImage
  } = useContext(PresentationContext);

  const { templateTemplateInfo } = useContext(TemplateContext);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [noImage, setNoImage] = useState(false);
  const [imgSrc, setImgSrc] = useState(image);
  const [showMenu, setShowMenu] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [focusPoint, setFocusPoint] = useState({
    x: focusPointX ?? 50,
    y: focusPointY ?? 50,
  });
  const [scale, setScale] = useState(initialScale);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [objectFit, setObjectFit] = useState<ImageFit>(imageFit ?? 'cover');

  const templateInfo = presentationTemplateInfo || templateTemplateInfo;

  useEffect(() => {
    if (imgRef.current) {
      const { clientWidth, clientHeight } = imgRef.current;
      const ratio = clientWidth / clientHeight;
      setAspectRatio(ratio);
    }
  }, [imgSrc, isCropping]);

  useEffect(() => {
    const t = setTimeout(() => {
      onTransform?.(Math.round(focusPoint.x), Math.round(focusPoint.y), scale, objectFit);
    }, 1000);
    return () => clearTimeout(t);
  }, [focusPoint, scale, objectFit]);

  useEffect(() => {
    setImgSrc(image);
    setNoImage(false);
  }, [image]);

  useEffect(() => {
    onActions?.(showMenu || showPromptInput);
  }, [showMenu, showPromptInput]);

  const handleClick = (event: React.MouseEvent) => {
    if (!isPreview) {
      setActiveImage({ slideId, contentId, keywords });
      setMenuPosition({ x: event.clientX, y: event.clientY });
      setShowMenu(!showMenu);
      setShowPromptInput(false);
    }
  };

  const handleEdit = () => {
    if (!isPreview) {
      setActiveImage({ slideId, contentId, keywords });
      setShowMenu(!showMenu);
    }
  };

  const loading =
    (contentId && loadingImageContentId === contentId) ||
    (!contentId && loadingImageSlideId === slideId);

  const handleMenuClick = (id: string) => menuItems?.find((i) => i.id === id)?.onAction();

  const changeFocusPoint = (x: number, y: number) => {
    setFocusPoint({ x, y });
  };

  const handleOpenImageOptionSidebar = () => {
    showSideBar('webimages');
    setActiveImage({ slideId, contentId, keywords });
    setShowMenu(false);
  };

  const handleTransform = () => {
    if (imgSrc && slideId) {
      setTransformOpen(true);
      setReferenceImage({imageUrl: imgSrc, slideId: slideId, contentId: contentId});
      setShowMenu(false);
    }
  };

  const handleMove = () => {
    setActiveImage({ slideId, contentId, keywords });
    setIsCropping(true);
    setShowMenu(false);
  };

  const handleOpenContextMenu = () => {
    setActiveImage({ slideId, contentId, keywords });
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const isActiveImage = useMemo(() => {
    return activeImage?.slideId === slideId && activeImage?.contentId === contentId;
  }, [activeImage?.contentId, activeImage?.slideId, contentId, slideId]);

  const menuItems: IImageAction[] = [
    {
      labelKey: 'replace',
      id: 'replace',
      onAction: handleOpenImageOptionSidebar,
      icon: <ReplaceIcon />,
    },
    {
      labelKey: 'transform',
      id: 'transform',
      onAction: handleTransform,
      icon: <Replace className='size-5' />,
    },
    {
      labelKey: 'move',
      id: 'move',
      onAction: handleMove,
      icon: <MoveIcon />,
    },
  ];

  const handleIsCropping = (isCropping: boolean) => {
    setIsCropping(isCropping);
    setActiveImage(null);
  };

  const handleScale = (value: number[]) => {
    if (value[0] < 1) {
      setScale(1);
      return;
    }
    setScale(value[0]);
  };

  const renderImage = () => (
    <>
      {imgSrc && imageFit === 'contain' && (
        <img
          src={imgSrc}
          className="absolute inset-0 size-full object-cover blur-lg"
          draggable={false}
        />
      )}

      <img
        crossOrigin="anonymous"
        id={imgSrc}
        src={imgSrc}
        onLoad={() => {
          setNoImage(false);
          setImageLoaded(true);
        }}
        onError={() => {
          setNoImage(true);
          setImageLoaded(false);
        }}
        className={cn(
          `size-full object-cover ${templateInfo?.roundingSizePreview && `${templateInfo.roundingSizePreview}`}`,
          className,
          {
            'rounded-full': isCircular,
            'animate-pulse': !isPreview && !presentation?.generationFinished,
            'p-1': templateInfo?.roundingSize && !ignorePadding,
          },
        )}
        onClick={isPreview ? undefined : handleClick}
        style={{
          display: imageLoaded ? 'block' : 'none',
          objectPosition: isPreview
            ? `${focusPointX}% ${focusPointY}%`
            : `${focusPoint.x}% ${focusPoint.y}%`,
          transform: `scale(${scale})`,
          transformOrigin: `${focusPoint.x}% ${focusPoint.y}%`,
          objectFit: imageFit || 'cover',
        }}
      />
    </>
  );

  const renderImageContainer = () => (
    <div
      className={cn(`${className} relative overflow-hidden`, {
        'rounded-full': isCircular,
        'border-2 border-pink': isActiveImage && !isPreview && presentation?.generationFinished,
        'no-drag': isCropping
      })}
      onBlur={() => {
        !isPreview && setIsCropping(false);
        !isPreview && setShowMenu(false);
      }}
    >
      {(noImage || loading) && (
        <EmptyImage
          onClick={handleClick}
          loading={!presentation?.generationFinished || loading}
          slide={activeSlide?.id === slideId ? activeSlide : undefined}
          theme={theme}
          isPreview={isPreview}
        />
      )}

      <div className={`${!className?.includes('screen') && "absolute inset-0"}`}>
        {!isPreview ? (
          <ContextMenuTrigger>
            <ImageCenterPointSelector
              onUpdate={changeFocusPoint}
              focusPointX={focusPoint.x}
              focusPointY={focusPoint.y}
              animatePulse={!presentation?.generationFinished && !isPreview}
              imgSrc={imgSrc}
              handleChangeIsCropping={handleIsCropping}
              scale={scale}
              isCropping={isCropping}
              onClick={isPreview ? undefined : handleClick}
              loading={!presentation?.generationFinished || loading}
              slide={activeSlide}
              isPreview={isPreview}
              template={templateInfo}
              ignorePadding={ignorePadding}
              theme={theme}
              imageFit={objectFit}
            />
          </ContextMenuTrigger>
        ) : !noImage ? (
          renderImage()
        ) : (
          <ContextMenuTrigger>{renderImage()}</ContextMenuTrigger>
        )}
      </div>
    </div>
  );

  if (isMobile && !className?.includes('screen')) {
    return (
      <>
        <div
          className={cn(`${className} relative overflow-hidden`)}
          onBlur={() => setShowMenu(false)}
        >
          {(noImage || loading) && (
            <EmptyImage
              onClick={handleClick}
              loading={!presentation?.generationFinished || loading}
              slide={activeSlide}
              isPreview={isPreview}
              theme={theme}
            />
          )}

          {imgSrc && imageFit === 'contain' && (
            <img
              src={imgSrc}
              className="absolute inset-0 size-full object-cover blur-lg"
              draggable={false}
            />
          )}

          <img
            id={imgSrc}
            src={imgSrc}
            ref={imgRef}
            onLoad={() => {
              setNoImage(false);
              setImageLoaded(true);
            }}
            onError={() => {
              setNoImage(true);
              setImageLoaded(false);
            }}
            className={cn(`size-full object-cover absolute inset-0`, {
              'rounded-full': isCircular,
              'animate-pulse': !presentation?.generationFinished && !isPreview,
            })}
            onClick={handleEdit}
            style={{
              objectPosition: `${focusPointX}% ${focusPointY}%`,
              display: imageLoaded ? 'block' : 'none',
              objectFit: imageFit || 'cover',
            }}
          />
        </div>
        <Sheet open={showMenu}>
          <SheetContent
            outsideclose="true"
            side="right"
            className="flex h-dvh w-full flex-col items-start justify-between bg-lightGrey p-0"
          >
            <div className="flex h-1/2 w-full flex-col items-center p-4">
              <Button
                variant={'ghost'}
                className="mb-4 w-full justify-start ps-0"
                onClick={() => setShowMenu(false)}
              >
                <ArrowBack />
              </Button>
              <SheetTitle className="hidden">{t('imageComponent')}</SheetTitle>
              <div className="relative size-full overflow-hidden">
                <img
                  id={imgSrc}
                  src={imgSrc}
                  onError={() => setNoImage(true)}
                  className={cn(`object-cover w-full h-full ${align}`, {
                    'rounded-full': isCircular,
                  })}
                  onClick={handleEdit}
                  style={{
                    objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
                    aspectRatio: aspectRatio ?? 'auto',
                    transform: `scale(${scale})`,
                    transformOrigin: `${focusPoint.x}% ${focusPoint.y}%`,
                    objectFit: imageFit || 'cover',
                  }}
                />
              </div>
            </div>

            <ImageActions
              mobile
              x={menuPosition.x}
              y={menuPosition.y}
              imageFit={objectFit}
              setImageFit={setObjectFit}
              isOpen={showMenu}
              items={menuItems}
              onClickItem={handleMenuClick}
              onClose={() => {
                setActiveImage(null);
                setShowMenu(false);
              }}
            />
          </SheetContent>
        </Sheet>

        <AlignSheet
          showAlign={isCropping}
          focusPointX={focusPoint.x}
          focusPointY={focusPoint.y}
          onOpenChange={() => handleIsCropping(!isCropping)}
          onUpdateFocusPoint={changeFocusPoint}
          isCircular={isCircular}
          animatePulse={!presentation?.generationFinished && !isPreview}
          imgSrc={imgSrc}
          aspectRatio={aspectRatio}
          handleIsCropping={handleIsCropping}
          scale={scale}
          isCropping={isCropping}
        />
      </>
    );
  }

  return (
    <ContextMenu onOpenChange={handleOpenContextMenu}>
      {renderImageContainer()}

      {!isPreview && activeSlide?.slideType !== 'free-slide' && (
        <>
          <ImageActions
            x={menuPosition.x}
            y={menuPosition.y}
            imageFit={objectFit}
            setImageFit={setObjectFit}
            isOpen={showMenu}
            items={menuItems}
            onClickItem={handleMenuClick}
            onClose={() => {
              setShowMenu(false);
            }}
            footer={
              <div className="pb-3 pt-4">
                <Slider
                  defaultValue={[scale]}
                  value={[scale]}
                  max={2}
                  min={1}
                  step={0.01}
                  onValueChange={handleScale}
                />
              </div>
            }
          />
        </>
      )}

      <ContextMenuContent className="w-[200px]">
        <ContextMenuItem
          className="flex items-center gap-2 p-2"
          onClick={handleOpenImageOptionSidebar}
        >
          <ReplaceIcon />
          {t('replace')}
        </ContextMenuItem>
        <ContextMenuItem className="flex items-center gap-2 p-2" onClick={handleMove}>
          <MoveIcon />
          {t('move')}
        </ContextMenuItem>
        {contentId && (
          <ContextMenuItem
            className="flex items-center gap-2 p-2"
            onClick={() => deleteContent(contentId)}
          >
            <Trash />
            {t('delete')}
          </ContextMenuItem>
        )}
        <ImageFitMenu imageFit={objectFit} setImageFit={setObjectFit} />
        {setBorderRadius && contentId && (
          <BorderRadiusSelector
            setBorderRadius={setBorderRadius}
            contentId={contentId}
            type="image"
          />
        )}

        <Divider />
        <div className="pb-3 pt-4">
          <Slider
            defaultValue={[scale]}
            value={[scale]}
            max={2}
            min={1}
            step={0.01}
            onValueChange={handleScale}
          />
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ImageComponent;
