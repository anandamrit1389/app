import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { PresentationContext } from '@/contexts/Presentation.context';
import useMobile from '@/hooks/useMobile';

import parse from 'html-react-parser';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getPreview } from '@/helpers/utils/preview';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SlideAlternativeSelector = () => {
  const isMobile = useMobile();
  const { changeSlideVariant, activeSlide, slideAlternatives, switchDimmedImage, showSideBar } =
    useContext(PresentationContext);
  const [active, setActive] = useState<string>('');

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleChangeSlideVariant = (val: string) => {
    const alt = slideAlternatives?.find((f) => f.name === val);
    setActive(alt?.mobile ?? '');
    changeSlideVariant(val);
    if (isMobile) {
      showSideBar();
    }
  };

  useEffect(() => {
    const alt = slideAlternatives?.find((f) => f.name === activeSlide?.variation);

    setActive(alt?.mobile ?? '');
  }, []);

  if (isMobile) {
    return (
      <>
        {slideAlternatives && slideAlternatives.length > 0 && (
          <AccordionItem value="slideAlternativeSelector" className="![&_div]:overflow-auto">
            <AccordionTrigger>
              <span className="text-[12px] font-semibold uppercase">{t('slideAlternatives')}</span>
            </AccordionTrigger>
            <AccordionContent>
              <Select onValueChange={handleChangeSlideVariant}>
                <SelectTrigger>
                  <div className="capitalize">{active}</div>
                </SelectTrigger>
                <SelectContent className="p-0 [&>div]:p-0">
                  <SelectGroup className="p-2">
                    {slideAlternatives?.map((variant) => (
                      <SelectItem
                        key={variant.name}
                        value={variant.name}
                        className="font-sm data-[disabled]:opacity-1 p-2 text-darkText hover:bg-lightGrey data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink"
                      >
                        {variant.mobile}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        )}
      </>
    );
  }

  return (
    <>
      {slideAlternatives && slideAlternatives.length > 0 && (
        <AccordionItem value="slideAlternativeSelector" className="![&_div]:overflow-auto">
          <AccordionTrigger>
            <span className="text-[12px] font-medium uppercase">{t('slideAlternatives')}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <div className="grid grid-cols-2 gap-4 p-1.5">
                {slideAlternatives?.map((variation, index) => {
                  return (
                    <div
                      key={variation.name + index}
                      className={
                        variation.name === activeSlide?.variation
                          ? 'size-full rounded p-0 outline outline-2 outline-offset-4 outline-pink'
                          : 'size-full rounded p-0 outline-2 outline-offset-4 outline-grey hover:outline'
                      }
                    >
                      <Button
                        variant="ghost"
                        onClick={() => changeSlideVariant(variation.name)}
                        className={
                          'size-full rounded p-0 outline-2 outline-offset-4 outline-grey hover:outline'
                        }
                      >
                        {parse(getPreview(variation.preview))}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {(activeSlide?.slideType === 'title-slide' ||
                activeSlide?.slideType === 'section-headline-slide') && (
                <div className="mt-4 flex items-center justify-between px-2">
                  {/* todo add translation */}
                  <Label htmlFor="pages">{t('improveReadability')}</Label>
                  <Switch
                    id="pages"
                    checked={activeSlide?.dimmedImage}
                    onCheckedChange={(e) => switchDimmedImage(e)}
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </>
  );
};

export default SlideAlternativeSelector;
