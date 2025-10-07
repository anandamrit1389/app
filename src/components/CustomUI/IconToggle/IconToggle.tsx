import { cn } from '@/lib/utils.ts';

interface ToggleItem {
  id: string;
  icon: React.ReactNode;
  title?: string;
}

interface ToggleProps {
  items: ToggleItem[];
  isToggled: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

const IconToggle = ({ items, isToggled, onToggle, mobile }: ToggleProps) => {
  return (
    <div
      className={cn('relative cursor-pointer rounded bg-lightGreyHover p-[2px] h-10', {
        'w-full': mobile,
        'w-[343px]': !mobile && items[0].title,
        'w-[74px] h-8': !mobile && !items[0].title,
      })}
      onClick={onToggle}
    >
      <div
        className={`absolute left-[2px] top-[2px] flex w-[calc(50%-2px)] items-center justify-center rounded-sm bg-white transition-transform duration-300 ease-in-out ${items[0].title ? 'h-9' : 'h-7'} ${isToggled ? '' : 'translate-x-full'}`}
      />
      <div className="absolute inset-0 flex items-center justify-between px-2">
        {items.map((item) => (
          <div
            className="flex cursor-pointer items-center justify-center rounded-sm text-sm"
            key={item.id}
          >
            {item.title ? (
              <>
                {item.icon}
                <span>{item.title}</span>
              </>
            ) : (
              item.icon
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconToggle;
