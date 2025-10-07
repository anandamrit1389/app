import { ISlideVariation } from '../../../../interfaces/ISlideVariation';
import { IContent, ImageFit } from '../../../../interfaces/ISlides';
import TextComponent from '../TextComponent/TextComponent';
import CardActions from './CardActions/CardActions';
import ImageComponent from '../ImageComponent/ImageComponent';
import Loader from '@/assets/loader.svg?react';
import { useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../TextComponent/AnimatedText';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import { useTranslation } from 'react-i18next';

interface IProps {
  variation?: ISlideVariation;
  card: IContent;
  totalCount: number;
  index: number;
  isPreview?: boolean;
  onUpdateContent?: (val: IContent) => void;
  withoutCaption?: boolean;
  slideId: string;
  mobile?: boolean;
  horizontal?: boolean;
  ignorePadding?: boolean;
  forFreeSlide?: boolean;
}

const CardComponent = ({
  card,
  variation,
  index,
  totalCount,
  isPreview,
  onUpdateContent,
  withoutCaption,
  slideId,
  mobile,
  ignorePadding,
  forFreeSlide,
}: IProps) => {
  const { currentElement, selectedLanguage, originLanguage } = useContext(PresentationContext);
  const [actionsInsideCard, setActrionsInsideCards] = useState<boolean>(false);
  const [actionsInsideCardDebounced, setActionsInsideCardDebounced] = useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  useEffect(() => {
    const t = setTimeout(() => {
      setActrionsInsideCards(actionsInsideCardDebounced);
    }, 300);

    return () => clearTimeout(t);
  }, [actionsInsideCardDebounced]);

  const handleUpdateField = (val: string, field: 'title' | 'text') => {
    const updContent: IContent = updateTranslatableField(
      card,
      field,
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    onUpdateContent?.(updContent);
  };

  const handleImageTransform = (x: number, y: number, scale: number, imageFit: ImageFit) => {
    const updContent: IContent = {
      ...card,
      focusPointX: x,
      focusPointY: y,
      imageFit: imageFit,
      scale,
    };

    onUpdateContent?.(updContent);
  };

  const cardContent = (
    <div
      className={`relative h-full ${
        !isPreview &&
        !actionsInsideCard &&
        'hover:rounded-lg hover:outline hover:outline-1 hover:outline-offset-8 hover:outline-grey/25 '
      } ${variation?.containerClassName}`}
    >
      <div className={variation?.imageContainerClassName}>
        <ImageComponent
          image={card.image ?? ''}
          className={variation?.imageClassName}
          isPreview={isPreview}
          align={card.imageAlign}
          onTransform={handleImageTransform}
          slideId={slideId}
          contentId={card.id}
          onActions={setActionsInsideCardDebounced}
          keywords={card.imageKeyword}
          focusPointX={card.focusPointX}
          focusPointY={card.focusPointY}
          imageFit={card.imageFit}
          currentScale={card.scale}
          ignorePadding={ignorePadding}
        />
      </div>
      <div
        className={cn(variation?.textContainerClassName, {
          '[&>*]:pointer-events-auto pointer-events-none': !isPreview,
        })}
      >
        <TextComponent
          className={variation?.imageCaptionHeadingClassName}
          content={card.titleTranslations?.[selectedLanguage] ?? card.title}
          isPreview={isPreview}
          onUpdate={(val) => handleUpdateField(val, 'title')}
          onActions={setActionsInsideCardDebounced}
        />
        <TextComponent
          className={variation?.imageCaptionClassName}
          content={card.textTranslations?.[selectedLanguage] ?? card.text}
          isPreview={isPreview}
          onUpdate={(val) => handleUpdateField(val, 'text')}
          onActions={setActionsInsideCardDebounced}
          placeholder={forFreeSlide ? t("writeCaption") : ''}
        />
      </div>
    </div>
  );

  const withoutCaptionContent = (
    <div
      className={`relative h-full ${
        !isPreview &&
        !actionsInsideCard &&
        'hover:rounded-lg hover:outline hover:outline-1 hover:outline-offset-8 hover:outline-grey/25 '
      }`}
    >
      <ImageComponent
        image={card.image ?? '.'}
        className={variation?.imageClassName}
        isPreview={isPreview}
        align={card.imageAlign}
        onTransform={handleImageTransform}
        slideId={slideId}
        contentId={card.id}
        onActions={setActionsInsideCardDebounced}
        keywords={card.imageKeyword}
        focusPointX={card.focusPointX}
        focusPointY={card.focusPointY}
        imageFit={card.imageFit}
        currentScale={card.scale}
      />
    </div>
  );

  if (forFreeSlide) {
    return <div className={`h-full ${variation?.containerClassName}`}>{cardContent}</div>;
  }

  //loading
  if (currentElement && currentElement.contentId === card.id && card) {
    return (
      <div className="max-w-1/2">
        <div className={variation?.imageContainerClassName}>
          <ImageComponent
            image={card.image ?? '.'}
            className={variation?.imageClassName}
            isPreview={isPreview}
          />
        </div>
        <div className={variation?.textContainerClassName}>
          <AnimatedText
            classNames={variation?.imageCaptionHeadingClassName}
            text={card.titleTranslations?.[selectedLanguage] ?? card.title ?? '.'}
            speed={80}
            skipSwitch
          />
          <AnimatedText
            classNames={variation?.imageCaptionClassName}
            text={card.textTranslations?.[selectedLanguage] ?? card.text ?? '.'}
            speed={20}
            delay={500}
            skipSwitch={isPreview}
          />
        </div>
      </div>
    );
  }

  if (card?.image === null) {
    return (
      <div
        className={`${totalCount > 1 && totalCount < 4 ? `w-1/${totalCount}` : 'size-full'} ${
          variation?.containerClassName
        } flex items-center justify-center bg-grey`}
      >
        {!isPreview && <Loader className="size-[56px] animate-spin" />}
      </div>
    );
  }

  if (withoutCaption) {
    if (mobile) {
      return (
        <div
          className={`${totalCount > 1 ? `w-1/${totalCount}` : 'w-full'} ${
            variation?.containerClassName
          }`}
        >
          {withoutCaptionContent}
        </div>
      );
    }
    return (
      <HoverCard openDelay={50} closeDelay={50}>
        <HoverCardTrigger
          className={`${totalCount > 1 ? `w-1/${totalCount}` : 'w-full'} ${
            variation?.containerClassName
          }`}
        >
          {withoutCaptionContent}
        </HoverCardTrigger>
        {!isPreview && (
          <HoverCardContent
            className="size-auto border-none bg-transparent shadow-none"
            side="top"
            sideOffset={-30}
          >
            <CardActions index={index} totalCount={totalCount} card={card} slideId={slideId} />
          </HoverCardContent>
        )}
      </HoverCard>
    );
  }

  if (mobile) {
    return (
      <div
        className={`${totalCount > 1 ? `w-1/${totalCount}` : 'w-full'} ${
          variation?.containerClassName
        }`}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger
        className={`${totalCount > 1 && `w-1/${totalCount}`} ${
          totalCount === 1 && (variation?.type === 'full' ? 'w-full' : 'w-1/2 m-auto')} ${
            variation?.containerClassName
          }`}
      >
        {cardContent}
      </HoverCardTrigger>
      {!isPreview && !mobile && !actionsInsideCard && (
        <HoverCardContent
          className="size-auto border-none bg-transparent shadow-none"
          side="top"
          sideOffset={-30}
        >
          <CardActions index={index} totalCount={totalCount} card={card} slideId={slideId} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default CardComponent;
