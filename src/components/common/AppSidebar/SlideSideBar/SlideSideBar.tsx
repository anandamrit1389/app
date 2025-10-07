import { PresentationContext } from '@/contexts/Presentation.context';
import Trash from '@/assets/trash.svg?react';
import { useContext } from 'react';
import SlideAlternativeSelector from './SlideAlternativeSelector';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import SlideNotes from './SlideNotes';
import { Accordion } from '@/components/ui/accordion';
import GenerateNewLayoutSelector from './GenerateNewLayoutSelector';
import { Switch } from '@/components/ui/switch';
import { themeSwitchMap } from '@/helpers/constants/themes.const';
import FontSlider from './FontSlider';
import Divider from '@/components/CustomUI/Divider/Divider';

const SlideSideBar = () => {
  const {
    presentation,
    deleteSlide,
    slideAlternatives,
    updateSlide,
    activeSlide,
    setActiveSlide,
    theme,
    fontSizes,
    setFontSizes
  } = useContext(PresentationContext);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleUpdateTheme = () => {
    if (!activeSlide) return;

    let updSlide;
    if (activeSlide?.themeId) {
      updSlide = { ...activeSlide, themeId: null };
    } else {
      updSlide = {
        ...activeSlide,
        themeId: presentation && themeSwitchMap[theme],
      };
    }
    setActiveSlide(updSlide);
    updateSlide(updSlide);
  };

  return (
    <>
      <Accordion
        defaultValue={['slideNotes', 'slideAlternativeSelector']}
        type="multiple"
        className="w-full"
      >
        <SlideNotes />
        <div className="flex items-center justify-between my-4 text-[12px] font-medium uppercase">
          <span>{t('changeAccentSlide')}</span>
          <Switch
            id="theme"
            checked={!!activeSlide?.themeId}
            onCheckedChange={() => {
              handleUpdateTheme();
            }}
            disabled={theme === 'personal'}
          />
        </div>
        {activeSlide?.slideType === 'free-slide' && (
          <div className='flex flex-col gap-4'>
            <Divider />
            <FontSlider 
              slide={activeSlide} 
              fontSizes={fontSizes} 
              setFontSizes={setFontSizes} 
              onUpdate={updateSlide}
            />
            <Divider />
          </div>
        )}
        {slideAlternatives && slideAlternatives.length > 1 && <SlideAlternativeSelector />}
        {!presentation?.speachMode && <GenerateNewLayoutSelector />}
      </Accordion>

      <BaseButton
        classNames="mt-4 w-full font-semibold h-10"
        variant="secondary"
        onClick={() => deleteSlide()}
      >
        {t('deleteSlide')} <Trash className="ms-1" />
      </BaseButton>
    </>
  );
};

export default SlideSideBar;
