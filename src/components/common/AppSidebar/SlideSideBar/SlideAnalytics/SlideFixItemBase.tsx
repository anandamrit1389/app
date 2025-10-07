import { X } from 'lucide-react';
import Bulb from '@/assets/bulb.svg?react';
import { cn } from '@/lib/utils';

export interface SlideFixItem {
  title: string;
  color: string;
  description: string;
  image?: string;
}

export const SlideFixItemBase = ({
  item,
  onRemove,
  children,
}: {
  item: SlideFixItem;
  onRemove?: () => void;
  children?: React.ReactNode;
}) => {
  const { title, color, description, image } = item;
  return (
    <div className="relative grow py-4">
      <div className="flex justify-between">
        <div className="mt-2 flex gap-2">
          <div className="flex w-5 justify-center pt-2">
            <div className={cn(`size-2 rounded-full bg-[${color}]`)} />
          </div>
          <p className="text-[14px] font-semibold text-darkHeadline">{title}</p>
        </div>

        {onRemove && (
          <button className="" onClick={onRemove}>
            <X />
          </button>
        )}
      </div>
      <div className="mb-2 flex items-center gap-2">
        <Bulb className="min-w-5" />
        <p className="mt-1 text-[14px] text-tertiaryText">{description}</p>
      </div>

      {image && (
        <div className="mb-2 h-[150px] object-cover w-full">
          <img src={image} alt="low-res-image" className="h-full object-cover mx-auto" />
        </div>
      )}
      <div className="flex gap-2">{children}</div>
    </div>
  );
};
