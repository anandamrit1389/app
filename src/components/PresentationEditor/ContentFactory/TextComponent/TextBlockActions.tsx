import { EyeOff, Heading1, Heading2 } from 'lucide-react';
import Trash from '@/assets/trash.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import BorderRadiusSelector from '../ImageComponent/ImageActions/BorderRadiusSelector';
import { useTranslation } from 'react-i18next';
import { IContent } from '@/interfaces/ISlides';
// import VerticalAlignMenu from './VerticalAlignMenu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  content: IContent;
  deleteContent: (id: string) => void;
  toggleContentBg: (id: string) => void;
  setBorderRadius: (id: string, val: string) => void;
  setAlignVertical?: (id: string, val: string) => void;
  handleTitle: (id: string, field: 'title' | 'subtitle', value: string) => void;
  mobile?: boolean;
}

const TextBlockActions = ({
  isOpen,
  content,
  deleteContent,
  toggleContentBg,
  setBorderRadius,
  // setAlignVertical,
  handleTitle,
  mobile
}: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [open, setOpen] = useState(isOpen);

  if (mobile && isOpen) {
    return (
      <Sheet modal={false} open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-4 bg-white font-family-inter shadow-lg">
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start flex items-center gap-4 px-4 py-3 font-normal"
            onClick={() => handleTitle(content.id, 'title', 'title')}
            disabled={!!content.title}
          >
            <Heading1 className="size-5" /> {t('addTitle')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start flex items-center gap-4 px-4 py-3 font-normal"
            onClick={() => handleTitle(content.id, 'subtitle', 'subtitle')}
            disabled={!!content.subtitle}
          >
            <Heading2 className="size-5" /> {t('addSubtitle')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start flex items-center gap-2 px-4 py-3 font-normal"
            onClick={() => toggleContentBg(content.id)}
          >
            <EyeOff /> {t('toggleBg')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="text-darkGrey w-full justify-start flex items-center gap-4 px-4 py-3 font-normal"
            onClick={() => deleteContent(content.id)}
          >
            <Trash /> {t('delete')}
          </BaseButton>
          {/* <VerticalAlignMenu
            contentId={content.id}
            setAlignVertical={setAlignVertical}
            mobile
          /> */}
          <BorderRadiusSelector
            setBorderRadius={setBorderRadius}
            contentId={content.id}
            type="text"
            mobile
          />
        </SheetContent>
      </Sheet>
    );
  }
  
  if (isOpen)
    return (
      <div>
        <div className="font-family-inter w-[200px] rounded-lg bg-white shadow-lg">
          <BaseButton
            variant="ghost"
            classNames="flex text-darkGrey w-full justify-start font-normal p-3 gap-4"
            onClick={() => handleTitle(content.id, 'title', 'title')}
            disabled={!!content.title}
          >
            <Heading1 className="size-5" /> {t('addTitle')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="flex text-darkGrey w-full justify-start font-normal p-3 gap-4"
            onClick={() => handleTitle(content.id, 'subtitle', 'subtitle')}
            disabled={!!content.subtitle}
          >
            <Heading2 className="size-5" /> {t('addSubtitle')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="flex text-darkGrey w-full justify-start font-normal p-3"
            onClick={() => toggleContentBg(content.id)}
          >
            <EyeOff /> {t('toggleBg')}
          </BaseButton>

          <BaseButton
            variant="ghost"
            classNames="flex text-darkGrey w-full justify-start font-normal p-3 gap-4"
            onClick={() => deleteContent(content.id)}
          >
            <Trash /> {t('delete')}
          </BaseButton>
          {/* <VerticalAlignMenu 
            setAlignVertical={setAlignVertical}
            contentId={content.id}
          /> */}
          <BorderRadiusSelector
            setBorderRadius={setBorderRadius}
            contentId={content.id}
            type="text"
          />
        </div>
      </div>
    );
};

export default TextBlockActions;
