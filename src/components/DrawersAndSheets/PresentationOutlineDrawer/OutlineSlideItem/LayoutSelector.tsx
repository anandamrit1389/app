import parse from 'html-react-parser';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  changableSlideVariations,
  slideTitleMap,
} from '@/helpers/constants/slide-variations.const';
import { ISlide } from '@/interfaces/ISlides';
import { useTranslation } from 'react-i18next';
import { getPreview } from '@/helpers/utils/preview';
import { useMemo } from 'react';

interface IProps {
  open: boolean;
  outline: ISlide;
  onOpenChange: () => void;
  onSelect: (type: string, variant: string) => void;
}

const LayoutSelector = ({ outline, onSelect, onOpenChange, open }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const slideTypes = useMemo(() => Object.keys(changableSlideVariations), []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-screen min-w-fit justify-center overflow-auto rounded-l-xl"
      >
        <div className="size-full min-w-96">
          <SheetTitle className="text-center">{t('changeLayout')}</SheetTitle>
          <div className="pb-8 text-center">
            {outline?.slideType && (
              <div>
                {slideTypes?.map((type) => {
                  const variations = changableSlideVariations[type];
                  
                  return (
                    <div key={type}>
                      <p className="my-4 text-left">{slideTitleMap[type] || type}</p>
                      <div className="grid grid-cols-2 gap-4">
                        {variations && variations.length ? (
                          variations.map((v) => (
                            <div
                              key={v.name}
                              onClick={() => {
                                onSelect(type, v.name);
                              }}
                              className={`${
                                (v.name === outline?.variation && type === outline?.slideType)
                                  ? 'rounded-lg outline outline-2 outline-offset-4 outline-pink'
                                  : 'rounded-lg outline-2 outline-offset-4 outline-grey hover:outline'
                              }`}
                            >
                              {v.preview && parse(getPreview(v.preview))}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-4 text-gray-500">
                            {t('noLayoutsAvailable')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LayoutSelector;
