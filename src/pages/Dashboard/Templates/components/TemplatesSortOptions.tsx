import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface IProps {
  menuOpen?: boolean;
  onOpenChange?: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  mobile?: boolean;
}

const sortOptions = [
  {
    labelKey: 'newest',
    value: 'newest',
  },
  {
    labelKey: 'popular',
    value: 'popular',
  },
];

const TemplatesSortOptions = ({
  menuOpen,
  onOpenChange,
  mobile,
  activeFilter,
  setActiveFilter,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  if (mobile) {
    return (
      <Sheet open={menuOpen} onOpenChange={() => onOpenChange?.()}>
        <SheetContent
          outsideclose="true"
          side="bottom"
          className="flex h-1/2 flex-col justify-start rounded-t-xl"
        >
          <SheetTitle>{t('sortOrder')}</SheetTitle>
          <div className="flex flex-col">
            {sortOptions?.map((variant) => (
              <Button
                variant={'ghost'}
                key={variant.value}
                className={`font-sm relative mb-1 justify-start p-2 font-normal text-darkText [&_svg]:size-6 [&_svg]:stroke-slushPink ${
                  variant.value === activeFilter ? 'bg-lightGrey' : ''
                }`}
                onClick={() => setActiveFilter(variant.value)}
              >
                <div
                  className={`flex items-center gap-2 ${
                    variant.value === 'deleted' ? 'text-[#B12525]' : 'text-darkText'
                  }`}
                >
                  {t(variant.labelKey)}
                </div>

                {variant.value === activeFilter && (
                  <span className="absolute right-2 flex size-5 items-center justify-center">
                    <Check className="size-4 text-slushPink" />
                  </span>
                )}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Select onValueChange={setActiveFilter}>
      <SelectTrigger>
        <div className="capitalize">{t(activeFilter)}</div>
      </SelectTrigger>
      <SelectContent className="p-0 [&>div]:p-0">
        <SelectGroup className="p-2">
          {sortOptions.map((variant) => (
            <SelectItem
              key={variant.value}
              value={variant.value}
              className="p-2 text-sm text-darkText hover:bg-lightGrey data-[disabled]:bg-lightGrey data-[disabled]:opacity-100 [&_svg]:size-6 [&_svg]:stroke-slushPink"
            >
              {t(variant.labelKey)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TemplatesSortOptions;
