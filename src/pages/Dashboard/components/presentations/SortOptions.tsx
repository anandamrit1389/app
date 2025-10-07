import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import Trash from '@/assets/trash.svg?react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useContext } from 'react';
import { PersonalContext } from '@/contexts/Dashboard.context';

interface IProps {
  menuOpen?: boolean;
  onOpenChange?: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  mobile?: boolean;
}

const sortOptions = [
  {
    labelKey: 'lastCreated',
    value: 'last created',
  },
  {
    labelKey: 'lastUpdated',
    value: 'last updated',
  },
  {
    labelKey: 'favorite',
    value: 'favorite',
  },
  {
    labelKey: 'deleted',
    value: 'deleted',
    icon: <Trash className="p-[2px] [&_path]:stroke-[#B12525]" />,
  },
];

export const SortOptions = ({
  menuOpen,
  onOpenChange,
  mobile,
  activeFilter,
  setActiveFilter,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { presentations } = useContext(PersonalContext);

  const hasFavorites = presentations.some((presentation) => presentation.isFavourite);

  if (mobile) {
    return (
      <Sheet open={menuOpen} onOpenChange={() => onOpenChange?.()}>
        <SheetContent
          hideclose="true"
          side="bottom"
          className="flex flex-col justify-start rounded-t-3xl"
        >
          <SheetTitle className="hidden">{t('sortOrder')}</SheetTitle>
          <div className="flex flex-col">
            {sortOptions?.map((variant) => {
              const isDisabled = variant.value === 'favorite' && !hasFavorites;

              return (
                <Button
                  variant={'ghost'}
                  key={variant.value}
                  disabled={isDisabled}
                  className={`font-sm relative mb-1 justify-start p-2 font-normal text-darkText [&_svg]:size-6 [&_svg]:stroke-slushPink ${
                    variant.value === activeFilter ? 'bg-lightGrey' : ''
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isDisabled && setActiveFilter(variant.value)}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      variant.value === 'deleted' ? 'text-[#B12525]' : 'text-darkText'
                    }`}
                  >
                    {variant.icon}
                    {t(variant.labelKey)}
                  </div>

                  {variant.value === activeFilter && (
                    <span className="absolute right-2 flex size-5 items-center justify-center">
                      <Check className="size-4 text-slushPink" />
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Select onValueChange={setActiveFilter} value={activeFilter}>
      <SelectTrigger className="min-w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="p-2 pb-1">
        {sortOptions?.map((variant) => {
          const isDisabled = variant.value === 'favorite' && !hasFavorites;
          return (
            <SelectItem
              key={variant.value}
              value={variant.value}
              disabled={isDisabled}
              className={`data-[disabled]:opacity-1 mb-1 p-2 font-normal text-darkText hover:bg-lightGrey data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  variant.value === 'deleted' ? 'text-[#B12525]' : 'text-darkText'
                }`}
              >
                {variant.icon}
                {t(variant.labelKey)}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
