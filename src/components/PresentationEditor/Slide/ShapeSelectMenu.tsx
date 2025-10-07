import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Button } from '@/components/ui/button';
import { MoveHorizontal, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { arrowShapeMap } from '@/helpers/utils/slides';

interface IProps {
  createContent: (type: 'shape', key: string, width: string) => void;
  setShowMenu: (val: boolean) => void;
}

const ShapeSelectMenu = ({ createContent, setShowMenu }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleClick = (key: string, width: string) => {
    createContent('shape', key, width);
    setShowMenu(false);
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full flex justify-between pe-2 font-normal pl-1 py-2"
        >
          <div className="flex w-full items-center justify-start gap-4 text-darkGrey">
            <div className="w-6 pl-2">
              <MoveHorizontal className="size-5" />
            </div>
            <span>{t("shape")}</span>
          </div>
          <ChevronUp />
        </BaseButton>
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="start"
        className="p-1 rounded-lg bg-white shadow-md z-50 w-[240px]"
      >
        {Object.entries(arrowShapeMap).map(([key, value]) => (
          <Button
            key={key}
            variant="ghost"
            onClick={() => handleClick(key, value.defaultWidth)}
            className="w-full gap-4 p-3 hover:bg-gray-100"
          >
            <div
              className="size-4"
            >
              <value.component fill="#111111" stroke="#111111" />
            </div>
          </Button>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ShapeSelectMenu;
