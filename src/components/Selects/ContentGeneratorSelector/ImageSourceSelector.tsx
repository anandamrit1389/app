import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContext, useState } from 'react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import ImageSource from '@/assets/image-source.svg?react';

const ImageSourceSelector = ({ mobile }: { mobile?: boolean }) => {
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const { imageSource, updateImageSource } = useContext(PromptPageContext);

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  if (mobile) {
    return (
      <>
        <Button
          variant="ghost"
          className="flex h-auto w-full gap-3 rounded-lg bg-lightGreyHover px-5 py-2 font-semibold"
          onClick={() => setShowSelector(!showSelector)}
        >
          <div className="flex items-center gap-3">
            <ImageSource />
            <p className="text-start">
              {imageSource?.length > 1 ? imageSource.join(' + ') : imageSource}
            </p>
          </div>
        </Button>

        <Sheet
          modal={false}
          open={showSelector}
          onOpenChange={() => setShowSelector(!showSelector)}
        >
          <SheetContent
            hideclose="true"
            side="bottom"
            className="flex w-full flex-col justify-start rounded-t-3xl bg-white"
          >
            <SheetTitle className="hidden">{t('imagePreferenceSelector')}</SheetTitle>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={imageSource.includes('AI')}
                onCheckedChange={() => {
                  updateImageSource('AI');
                }}
              />
              <Label>{t('aiImages')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                disabled
                checked={imageSource.includes('Stock')}
                onCheckedChange={() => {
                  updateImageSource('Stock');
                }}
              />
              <Label>{t('stockPhotos')}</Label>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-3 rounded-lg border-none bg-lightGreyHover px-5 py-2 text-[14px]">
          <ImageSource />
          {imageSource?.length > 1 ? imageSource.join(' + ') : imageSource}
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={imageSource.includes('AI')}
          onCheckedChange={() => {
            updateImageSource('AI');
          }}
        >
          {t('aiImages')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          disabled
          checked={imageSource.includes('Stock')}
          onCheckedChange={() => {
            updateImageSource('Stock');
          }}
        >
          {t('stockPhotos')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageSourceSelector;
