import CardActions from '../CardComponent/CardActions/CardActions';
import TextComponent from '../TextComponent/TextComponent';
import { IContent } from '@/interfaces/ISlides';
import { ISlideVariation } from '@/interfaces/ISlideVariation';
import { useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../TextComponent/AnimatedText';

interface IProps {
  variation?: ISlideVariation;
  item: IContent;
  totalCount: number;
  index: number;
  isPreview?: boolean;
  slideId: string;
  mobile?: boolean;
  startPosition?: number;
}

const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const ContentItemComponent = ({
  item,
  index,
  totalCount,
  isPreview,
  slideId,
  mobile,
  startPosition = 0,
}: IProps) => {
  const { currentElement, selectedLanguage } = useContext(PresentationContext);
  const [actionsInsideCard, setActionsInsideCards] = useState<boolean>(false);

  const cardContent = (
    <div className="relative max-h-max w-full py-contentMargin">
      <div className="items-top m-0 flex size-full gap-content ps-content">
        <div className="flex h-fit items-center gap-content">
          <TextComponent
            className={`font-bodyFont ${
              mobile ? 'text-sm' : 'text-subheadline'
            }  font-semibold leading-tight text-normalSubHeadline`}
            content={formatNumber(startPosition + index + 1)}
            isPreview={isPreview}
            disabled
          />
          {totalCount >= 8 && <div className="mb-1 h-0.5 w-content bg-shape"></div>}
        </div>
        <TextComponent
          className={`line-clamp-2 font-bodyFont ${
            mobile ? 'text-sm' : 'text-subheadline'
          }  font-semibold leading-tight text-normalSubHeadline`}
          content={item.textTranslations?.[selectedLanguage] ?? item.text}
          isPreview={isPreview}
          onActions={setActionsInsideCards}
          disabled
        />
      </div>
    </div>
  );

  //loading
  if (currentElement && item && currentElement.contentId === item.id) {
    return (
      <div
        className={cn('flex ps-content py-content w-full', {
          'border-b-shapeStroke border-b': index + 1 < totalCount && totalCount < 8,
        })}
      >
        <div className="w-2/12">
          <p className="font-titleFont text-subheadline font-semibold text-normalSubHeadline">
            {formatNumber(startPosition + index + 1)}
          </p>
        </div>
        <AnimatedText
          classNames="text-subheadline text-normalSubHeadline font-semibold w-10/12 font-bodyFont w-full"
          text={item.textTranslations?.[selectedLanguage] ?? item.text ?? '.'}
          skipSwitch={isPreview}
          speed={20}
        />
      </div>
    );
  }

  if (mobile) {
    return (
      <div
        className={cn({
          'border-b-shapeStroke border-b w-full flex overflow-hidden':
            index + 1 < totalCount && totalCount < 8,
        })}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <HoverCard openDelay={50} closeDelay={50} key={item.id}>
      <HoverCardTrigger
        className={cn({
          'border-b-shapeStroke border-b w-full flex overflow-hidden':
            index + 1 < totalCount && totalCount < 8,
        })}
      >
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
            agendaActions
          />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ContentItemComponent;
