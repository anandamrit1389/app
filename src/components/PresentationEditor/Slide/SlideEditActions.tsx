import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PresentationContext } from '@/contexts/Presentation.context';
import { Pencil, Type, Image, ImageUp, ImagePlus, Eye } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ShapeSelectMenu from './ShapeSelectMenu';
import ImageCaption from '@/assets/image-caption-slide.svg?react';

const SlideEditActions = ({ isGenerating }: { isGenerating: boolean }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [blur, setBlur] = useState(true);
  const [slideBgEnabled, setSlideBgEnabled] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const { activeSlide, setActiveSlide, createContent, updateSlide, showSideBar, setActiveImage } =
    useContext(PresentationContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (!activeSlide || !activeSlide?.backgroundProperties) return;
    const bgProperties = JSON.parse(activeSlide?.backgroundProperties);

    setBlur(bgProperties.blur !== undefined ? bgProperties.blur : true);
    setSlideBgEnabled(
      bgProperties.slideBgEnabled !== undefined ? bgProperties.slideBgEnabled : true,
    );
  }, [activeSlide?.backgroundProperties]);

  const handleClick = () => {
    if (activeSlide) {
      setShowMenu(false);
      setSlideBgEnabled(true);
      showSideBar('webimages');
      setActiveImage({ slideId: activeSlide.id, keywords: 'background' });
    }
  };

  const handleBlur = () => {
    updateSlideBackground('blur', !blur);
    setBlur(!blur);
  };

  const handleBackground = () => {
    updateSlideBackground('slideBgEnabled', !slideBgEnabled);
    setSlideBgEnabled(!slideBgEnabled);
  };

  const updateSlideBackground = (field: string, value: boolean) => {
    if (!activeSlide) return;

    const bgProperties = activeSlide?.backgroundProperties
      ? JSON.parse(activeSlide?.backgroundProperties)
      : {};

    const updProperties = {
      ...bgProperties,
      [field]: value,
    };

    updateSlide?.({
      ...activeSlide,
      backgroundProperties: JSON.stringify(updProperties),
    });
    setActiveSlide({
      ...activeSlide,
      backgroundProperties: JSON.stringify(updProperties),
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      {activeSlide?.slideType === 'free-slide' && (
        <BaseButton
          variant="secondary"
          size="icon"
          onClick={() => setShowMenu((prev) => !prev)}
          classNames="transition-all w-8 rounded-lg p-0 overflow-hidden h-8"
          disabled={isGenerating}
        >
          <Pencil className="size-4" />
        </BaseButton>
      )}

      {activeSlide?.slideType === 'free-slide' && showMenu && (
        <div className="absolute -left-28 bottom-10 w-60 rounded-md bg-white text-darkGrey drop-shadow">
          <ShapeSelectMenu createContent={createContent} setShowMenu={setShowMenu} />
          <Button
            variant="ghost"
            onClick={() => {
              setShowMenu(false);
              createContent('text');
            }}
            className="w-full gap-4 p-3 hover:bg-gray-100"
          >
            <Type />
            <span className="w-full text-left font-normal">{t('text')}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setShowMenu(false);
              createContent('image');
            }}
            className="w-full gap-4 p-3 hover:bg-gray-100"
          >
            <Image />
            <span className="w-full text-left font-normal">{t('image')}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setShowMenu(false);
              createContent('card');
            }}
            className="w-full gap-4 p-3 hover:bg-gray-100"
          >
            <ImageCaption />
            <span className="w-full text-left font-normal">{t('imageCaption')}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleClick}
            className="w-full gap-4 p-3 hover:bg-gray-100"
          >
            <ImagePlus />
            <span className="w-full text-left font-normal">{t('replaceBg')}</span>
          </Button>
          <div className="flex h-10 items-center justify-center gap-4 p-3">
            <ImageUp className="size-5" />
            {t('showBg')}
            <Switch
              id="background"
              checked={slideBgEnabled}
              onCheckedChange={handleBackground}
              className="ml-auto"
            />
          </div>
          <div className="h-10 flex items-center justify-center gap-4 p-3">
            <Eye className="size-5 " />
            {t('blurBg')}
            <Switch id="blur" checked={blur} onCheckedChange={handleBlur} className="ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditActions;
