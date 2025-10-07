import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import parse from 'html-react-parser';
import { newSlideVariations } from '@/helpers/constants/slide-variations.const';
import { useRef } from 'react';
import { getPreview } from '@/helpers/utils/preview';

interface IProps {
  slideType: string;
  slideVariation: string;
  description: string;
  index: number;
}

const PrettifyOutlineSlide = ({ slideType, slideVariation, description, index }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const slideVariations = newSlideVariations[slideType];
  const variation = slideVariations?.find((v) => v.name === slideVariation) ?? slideVariations?.[0];

  return (
    <div className="size-full" ref={ref}>
      <div>{variation?.preview && parse(getPreview(variation?.preview))}</div>
       <div className="items-top relative flex gap-1">
        <div className="rounded-full bg-black p-2 size-5 flex items-center justify-center mt-5">
          {index && (
            <p className="text-[12px] font-semibold text-white">{index}</p>
          )}
        </div>
        <div className="w-full mt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className="line-clamp-2 cursor-default bg-transparent rounded-lg px-2 pt-1 pr-0 outline outline-0 outline-grey/25 focus:outline-1"
                >
                  {description}
                </p>
              </TooltipTrigger>
              <TooltipContent
                className='bg-black border-none shadow-lg max-w-xs'
              >
                <p className="text-sm text-white">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PrettifyOutlineSlide;
