import CardActions from '../CardComponent/CardActions/CardActions';
import TextComponent from '../TextComponent/TextComponent';
import { IContent } from '@/interfaces/ISlides';
import { ISlideVariation } from '@/interfaces/ISlideVariation';
import { useContext, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../TextComponent/AnimatedText';

interface IProps {
  variation?: ISlideVariation;
  item: IContent;
  totalCount: number;
  index: number;
  isPreview?: boolean;
  onUpdateContent?: (val: string, id: string, field: 'title' | 'text') => void;
  slideId: string;
  mobile?: boolean;
}

const BulletPointComponent = ({
  item,
  variation,
  index,
  totalCount,
  isPreview,
  onUpdateContent,
  slideId,
  mobile,
}: IProps) => {
  const [actionsInsideCard, setActionsInsideCards] = useState(false);
  const {
    currentElement,
    presentationTemplateInfo: templateInfo,
    selectedLanguage,
  } = useContext(PresentationContext);
  const cardContent = (
    <>
      <div className="flex">
        {variation?.bulletPointClassName?.includes('arrow-shape') && (
          <div
            className={`rounded-l-lg ${
              !templateInfo?.sectionBg &&
              'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-transparent border-l-pageBg'
            } bg-shape`}
          ></div>
        )}
        <div className={variation?.bulletPointClassName}>
          <p className="w-full text-center">{variation?.showOrderNumber && index + 1}</p>
        </div>
        {variation?.bulletPointClassName?.includes('arrow-shape') && (
          <div
            className={`rounded ${
              !templateInfo?.sectionBg &&
              'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-pageBg border-l-shape'
            } bg-shape`}
          ></div>
        )}
      </div>
      <TextComponent
        className={variation?.contentSubtitleClassName}
        content={item.titleTranslations?.[selectedLanguage] ?? item.title}
        isPreview={isPreview}
        onUpdate={(val) => onUpdateContent?.(val, item.id, 'title')}
        onActions={setActionsInsideCards}
      />
      <TextComponent
        className={variation?.plainTextClassName}
        content={item.textTranslations?.[selectedLanguage] ?? item.text}
        isPreview={isPreview}
        onUpdate={(val) => onUpdateContent?.(val, item.id, 'text')}
        onActions={setActionsInsideCards}
      />
    </>
  );

  if (currentElement && currentElement.contentId === item.id && item) {
    return (
      <div className={`relative ${variation?.textContainerClassName}`}>
        <div className={variation?.bulletPointClassName}>
          <p className="text-center text-shapeText">
            {variation?.showOrderNumber && item.sortOrder}
          </p>
        </div>
        <AnimatedText
          classNames={variation?.contentSubtitleClassName}
          text={`${item.sortOrder} ${item.titleTranslations?.[selectedLanguage] ?? item.title}`}
          speed={40}
          skipSwitch
        />
        <AnimatedText
          classNames={variation?.plainTextClassName}
          text={item.textTranslations?.[selectedLanguage] ?? item.text ?? '.'}
          speed={5}
          delay={100}
          skipSwitch={isPreview}
        />
      </div>
    );
  }

  if (mobile) {
    return <div className={`relative ${variation?.textContainerClassName}`}>{cardContent}</div>;
  }

  return (
    <HoverCard openDelay={50} closeDelay={50} key={item.id}>
      <HoverCardTrigger className={`relative ${variation?.textContainerClassName}`}>
        {cardContent}
      </HoverCardTrigger>
      {!isPreview && !mobile && !actionsInsideCard && (
        <HoverCardContent
          className="size-auto border-none bg-transparent shadow-none"
          side="top"
          sideOffset={-30}
        >
          <CardActions
            index={index}
            totalCount={totalCount}
            card={item}
            slideId={slideId}
            listActions
          />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default BulletPointComponent;
