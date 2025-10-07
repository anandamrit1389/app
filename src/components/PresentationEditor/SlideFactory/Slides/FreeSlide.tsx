import Draggable from '../../ContentFactory/TextComponent/Draggable';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import { ImageFit, ISlide } from '@/interfaces/ISlides';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import { cn } from '@/lib/utils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import TextBlockActions from '../../ContentFactory/TextComponent/TextBlockActions';
import { BookType } from 'lucide-react';
import Trash from '@/assets/trash.svg?react';
import useMobile from '@/hooks/useMobile';
import { arrowShapeMap } from '@/helpers/utils/slides';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useTranslation } from 'react-i18next';
import CardComponent from '../../ContentFactory/CardComponent/CardComponent';
import { getSlideVariation } from '@/helpers/utils/renderHelpers';
import { variations } from './variations/free-slide';

type HorizontalAlignMap = Record<
  string,
  {
    title?: string;
    subtitle?: string;
    text?: string;
  }
>;

const FreeSlide = ({ slide, isPreview }: { slide: ISlide; isPreview?: boolean }) => {
  const {
    presentation,
    updateSlide,
    selectedLanguage,
    originLanguage,
    updateContent,
    deleteContent,
    setActiveSlide,
    theme,
    fontSizes,
    isFullscreen
  } = useContext(PresentationContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const blockButtonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isBlockOpen, setIsBlockOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [borderRadiusMap, setBorderRadiusMap] = useState<Record<string, string>>({});
  const [contentBgEnabled, setContentBgEnabled] = useState<Record<string, boolean>>({});
  const [verticalAlignMap, setVerticalAlignMap] = useState<Record<string, string>>({});
  const [horizontalAlignMap, setHorizontalAlignMap] = useState<HorizontalAlignMap>({});
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [blurEnabled, setBlurEnabled] = useState<boolean>(true);
  const [slideBgEnabled, setSlideBgEnabled] = useState<boolean>(true);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('top');
  const [shapeColor, setShapeColor] = useState('');
  const [isTextEditing, setIsTextEditing] = useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const isMobile = useMobile();

  useEffect(() => {
    const radiusMap: Record<string, string> = {};
    const bgMap: Record<string, boolean> = {};
    const verticalAlignMap: Record<string, string> = {};

    if (slide.backgroundProperties) {
      const slidePos = JSON.parse(slide.backgroundProperties);
      horizontalAlignMap[slide.id] = { title: slidePos.horizontalAlignTitle || 'text-left' };
    }

    slide.content.forEach((content) => {
      if (content.position) {
        const pos = JSON.parse(content.position);

        if (pos.borderRadius !== undefined) {
          radiusMap[content.id] = pos.borderRadius;
        }

        if (pos.bgEnabled !== undefined) {
          bgMap[content.id] = pos.bgEnabled;
        }

        if (content.contentType === 'text' || content.contentType === 'list-item') {
          if (pos.verticalAlign !== undefined) {
            verticalAlignMap[content.id] = pos.verticalAlign;
          }

          horizontalAlignMap[content.id] = {
            title: pos.horizontalAlignTitle ?? 'text-left',
            subtitle: pos.horizontalAlignSubtitle ?? 'text-left',
            text: pos.horizontalAlignText ?? 'text-left',
          };
        }
      }
    });

    setVerticalAlignMap(verticalAlignMap);
    setBorderRadiusMap(radiusMap);
    setContentBgEnabled(bgMap);
  }, [slide.content.length]);

  useEffect(() => {
    const themeElement = document.querySelector("[class*='theme-']");
    if (themeElement) {
      const computedStyle = getComputedStyle(themeElement as Element);
      const shapeColor = computedStyle.getPropertyValue('--bulletPoints').trim();
      setShapeColor(shapeColor);
    }
  }, [theme]);

  useEffect(() => {
    if (!slide.backgroundProperties) return;
    const pos = JSON.parse(slide.backgroundProperties);

    setBlurEnabled(pos.blur !== undefined ? pos.blur : true);
    setSlideBgEnabled(pos.slideBgEnabled !== undefined ? pos.slideBgEnabled : true);
  }, [slide.backgroundProperties, slide.accentImage]);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (
      activeContentId &&
      textBlockRefs.current[activeContentId] &&
      userAgent.indexOf('Chrome') === -1
    ) {
      const currentRef = textBlockRefs.current[activeContentId];
      if (currentRef) {
        currentRef.style.height = '0px';
        currentRef.style.height = `${currentRef.scrollHeight}px`;
      }
    }
    return () => {
      setIsBlockOpen(false);
    };
  }, [isEditing, activeContentId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeContentId && !isMobile) {
        const currentTextBlockRef = textBlockRefs.current[activeContentId];
        const currentButtonRef = blockButtonRefs.current[activeContentId];

        if (currentTextBlockRef) {
          const isClickOutsideTextBlock = !currentTextBlockRef.contains(event.target as Node);
          const isClickOutsideButton = !currentButtonRef?.contains(event.target as Node);

          if (isClickOutsideTextBlock && isClickOutsideButton) {
            setIsEditing(false);
            setIsBlockOpen(false);
            setActiveContentId(null);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeContentId, isEditing, slide.content]);

  const setTextBlockRef = (contentId: string) => (el: HTMLDivElement | null) => {
    textBlockRefs.current[contentId] = el;
  };

  const setBlockButtonRef = (contentId: string) => (el: HTMLDivElement | null) => {
    blockButtonRefs.current[contentId] = el;
  };

  const updateContentPosition = (contentId: string, posJson: string) => {
    const newContent = slide.content.map((c) =>
      c.id === contentId ? { ...c, position: posJson } : c,
    );
    updateSlide?.({ ...slide, content: newContent });
  };

  const handleDelete = (contentId: string) => {
    setActiveContentId(null);
    setIsEditing(false);
    setIsBlockOpen(false);

    deleteContent(contentId);
  };

  const handleTitle = (contentId: string, field: 'title' | 'subtitle', value: string) => {
    const updatedContent = slide.content.map((c) => {
      if (c.id === contentId) {
        return {
          ...c,
          [field]: value,
        };
      }
      return c;
    });

    updateSlide?.({
      ...slide,
      content: updatedContent,
    });
  };

  const handleUpdateField = (
    val: string,
    field: 'text' | 'title' | 'subtitle',
    contentId?: string,
  ) => {
    const contentItem = slide.content.find((c) => c.id === contentId);

    if (!contentId) {
      const updSlide = updateTranslatableField(
        slide,
        field,
        val,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );
      setActiveSlide(updSlide);
      updateSlide(updSlide);
    }

    if (contentItem) {
      const updatedContent = slide.content.map((item) => {
        if (item.id === contentId) {
          return updateTranslatableField(
            item,
            field,
            val,
            selectedLanguage,
            originLanguage === selectedLanguage,
          );
        }
        return item;
      });

      setActiveSlide({
        ...slide,
        content: updatedContent,
      });

      const updatedItem = updatedContent.find((c) => c.id === contentId);
      if (updatedItem) {
        updateContent?.(updatedItem, slide.id);
      }
    }
  };

  const handleBorderRadius = (contentId: string, value: string) => {
    setBorderRadiusMap((prev) => ({ ...prev, [contentId]: value }));
  };

  const handleVerticalAlign = (contentId: string, value: string) => {
    setVerticalAlignMap((prev) => ({ ...prev, [contentId]: value }));
  };

  const toggleContentBg = (contentId: string) => {
    setContentBgEnabled((prev) => ({
      ...prev,
      [contentId]: !prev[contentId],
    }));
  };

  const handleImageTransform = (x: number, y: number, scale: number, imageFit: ImageFit) => {
    const updSlide: ISlide = {
      ...slide,
      focusPointX: x,
      focusPointY: y,
      imageFit: imageFit,
      scale,
    };

    updateSlide?.(updSlide);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeContentId || isMobile) return;

    const target = e.target as Node;
    const blockButtonEl = blockButtonRefs.current[activeContentId];

    const clickedOnSelf =
      e.target === e.currentTarget || (blockButtonEl && blockButtonEl.contains(target));

    if (clickedOnSelf !== null) {
      setIsEditing(clickedOnSelf);
    }
  };

  const handleOpenBlock = () => {
    const ref = activeContentId ? textBlockRefs.current[activeContentId] : null;
    const container = containerRef.current;

    if (!ref || !container) return;

    const containerRect = container.getBoundingClientRect();
    const menuRect = ref.getBoundingClientRect();

    const containerMidY = containerRect.top + containerRect.height / 2;
    const menuCenterY = menuRect.top + menuRect.height / 2;

    setMenuPosition(menuCenterY < containerMidY ? 'bottom' : 'top');
    setIsBlockOpen(true);
  };

  // const updateFontSize = (contentId: string, type: 'title' | 'subtitle' | 'text', size: number) => {
  //   const content = slide.content.find((c) => c.id === contentId);
  //   if (!content || !content.position) return;

  //   setFontSizes((prev) => ({
  //     ...prev,
  //     [contentId]: {
  //       ...(prev[contentId] || {}),
  //       [type]: size,
  //     },
  //   }));

  //   const pos = JSON.parse(content.position);

  //   switch (type) {
  //     case 'title':
  //       pos.fontSizeTitle = size;
  //       break;
  //     case 'subtitle':
  //       pos.fontSizeSubtitle = size;
  //       break;
  //     case 'text':
  //       pos.fontSizeText = size;
  //       break;
  //   }

  //   const updatedContent = slide.content.map((c) => {
  //     if (c.id === contentId) {
  //       return {
  //         ...c,
  //         position: JSON.stringify(pos),
  //       };
  //     }
  //     return c;
  //   });

  //   updateSlide?.({ ...slide, content: updatedContent });
  // };

  const updateHorizontalAlign = (
    contentId: string,
    type: 'title' | 'subtitle' | 'text',
    value: string,
  ) => {
    if (contentId === slide.id) {
      setHorizontalAlignMap((prev) => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || {}),
          [type]: value,
        },
      }));

      const pos = slide.backgroundProperties ? JSON.parse(slide.backgroundProperties) : {};

      if (type === 'title') {
        pos.horizontalAlignTitle = value;
      }

      updateSlide?.({
        ...slide,
        backgroundProperties: JSON.stringify(pos),
      });

      return;
    }

    const content = slide.content.find((c) => c.id === contentId);
    if (!content || !content.position) return;

    setHorizontalAlignMap((prev) => ({
      ...prev,
      [contentId]: {
        ...(prev[contentId] || {}),
        [type]: value,
      },
    }));

    const pos = JSON.parse(content.position);

    switch (type) {
      case 'title':
        pos.horizontalAlignTitle = value;
        break;
      case 'subtitle':
        pos.horizontalAlignSubtitle = value;
        break;
      case 'text':
        pos.horizontalAlignText = value;
        break;
    }

    const updatedContent = slide.content.map((c) => {
      if (c.id === contentId) {
        return {
          ...c,
          position: JSON.stringify(pos),
        };
      }
      return c;
    });

    updateSlide?.({ ...slide, content: updatedContent });
  };

  const variation = getSlideVariation(variations, 'full');

  const validBG = useMemo(() => {
    if (!slide.accentImage) {return null}

    if (slide.accentImage?.includes('inabit') || slide.accentImage?.includes('localhost')) {
      const isAccentSlide = slide.themeId !== null;
      const isDarkTheme = presentation?.themeId?.includes('dark') || presentation?.themeId === 'grey';
      const isLightBGByDefault = slide.accentImage?.includes('light');

      if(isDarkTheme) {
        if(isLightBGByDefault) {
          return isAccentSlide ? slide.accentImage : slide.accentImage?.replace('light', 'dark');
        } else {
          return isAccentSlide ? slide.accentImage?.replace('dark', 'light') : slide.accentImage;
        }
      } else {
        if(isLightBGByDefault) {
          return isAccentSlide ? slide.accentImage?.replace('light', 'dark') : slide.accentImage;
        } else {
          return isAccentSlide ? slide.accentImage : slide.accentImage?.replace('dark', 'light');
        }
      }
    } else {
      return slide.accentImage;
    }
  }, [slide.accentImage, slide.themeId, presentation?.themeId]);

  return (
    <div className="relative size-full overflow-hidden flex flex-col">
      {slide.accentImage && (
        <div
          className={cn('absolute inset-0 z-0 bg-cover bg-center scale-[1.05] free-slide-bg', {
            'blur-sm': isPreview && blurEnabled,
            'blur-lg': !isPreview && blurEnabled,
          })}
          style={{
            backgroundImage: slideBgEnabled ? `url(${validBG})` : 'none',
          }}
        />
      )}
      <div className="px-contentTop pt-contentTop relative">
        <TextComponent
          content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
          isPreview={isPreview}
          onUpdate={(val) => handleUpdateField(val, 'title')}
          className={`font-bold text-headline text-smallHeading font-titleFont ${horizontalAlignMap[slide.id]?.title}`}
          onHorizontalAlign={(val) => updateHorizontalAlign(slide.id, 'title', val)}
        />
      </div>
      <div className="relative flex-1" ref={containerRef}>
        {slide.content?.map((content, index) => {
          const borderRadius = borderRadiusMap[content.id];
          const bgEnabled = contentBgEnabled[content.id] ?? true;
          if (content.contentType === 'text' || content.contentType === 'list-item') {
            const verticalAlign = verticalAlignMap[content.id];
            return (
              <Draggable
                key={content.id}
                contentId={content.id}
                positionJson={content.position}
                containerRef={containerRef}
                isPreview={isPreview}
                onUpdatePosition={(posJson) => updateContentPosition(content.id, posJson)}
                borderRadius={borderRadius}
                bgEnabled={bgEnabled}
                verticalAlign={verticalAlign}
                isActive={content.id === activeContentId}
                onActivate={setActiveContentId}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                isBlockOpen={isBlockOpen}
                contentType={content.contentType}
                isTextEditing={isTextEditing}
              >
                <div ref={setTextBlockRef(content.id)} className="size-full">
                  {parseFloat(borderRadius) > 100 && (
                    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                      <div
                        className="size-full rounded-full border-8 border-shape"
                        style={{ borderRadius }}
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      `text-freeSlideFontSize free-slide-text flex flex-col ${verticalAlign || ''} leading-tight p-content size-full hover:outline hover:outline-1 hover:outline-gray-700`,
                      {
                        'border border-shapeStroke': bgEnabled,
                        'border-4 bg-pageBg': parseFloat(borderRadius) > 100,
                        'bg-shape': parseFloat(borderRadius) < 100 && bgEnabled,
                      },
                    )}
                    style={{ ...((!isPreview || isFullscreen) && { borderRadius }) }}
                    onClick={handleClick}
                  >
                    <div>
                      {content.title && (
                        <TextComponent
                          onEdit={(val) => setIsTextEditing(val)}
                          content={content.titleTranslations?.[selectedLanguage] ?? content.title}
                          contentId={content.id}
                          isPreview={isPreview}
                          onUpdate={(val) => handleUpdateField(val, 'title', content.id)}
                          className={cn('font-semibold text-headline mb-freeSlideMargin', {
                            'text-center': parseFloat(borderRadius) > 100,
                            'text-freeSlideFontSize': isPreview
                          })}
                          // onFontSizeChange={(val) => updateFontSize(content.id, 'title', val)}
                          fontSize={fontSizes && fontSizes[slide.id]?.title}
                          onHorizontalAlign={(val) =>
                            updateHorizontalAlign(content.id, 'title', val)
                          }
                          horizontalAlign={horizontalAlignMap[content.id]?.title}
                        />
                      )}

                      {content.subtitle && (
                        <TextComponent
                          onEdit={(val) => setIsTextEditing(val)}
                          content={
                            content.subtitleTranslations?.[selectedLanguage] ?? content.subtitle
                          }
                          contentId={content.id}
                          isPreview={isPreview}
                          onUpdate={(val) => handleUpdateField(val, 'subtitle', content.id)}
                          className={cn('font-semibold text-headline mb-freeSlideMargin', {
                            'text-center': parseFloat(borderRadius) > 100,
                            'text-freeSlideFontSize': isPreview
                          })}
                          // onFontSizeChange={(val) => updateFontSize(content.id, 'subtitle', val)}
                          fontSize={fontSizes && fontSizes[slide.id]?.subtitle}
                          onHorizontalAlign={(val) =>
                            updateHorizontalAlign(content.id, 'subtitle', val)
                          }
                          horizontalAlign={horizontalAlignMap[content.id]?.subtitle}
                        />
                      )}

                      <TextComponent
                        onEdit={(val) => setIsTextEditing(val)}
                        content={content.textTranslations?.[selectedLanguage] ?? content.text ?? ''}
                        contentId={content.id}
                        isPreview={isPreview}
                        onUpdate={(val) => handleUpdateField(val, 'text', content.id)}
                        className={cn('text-normalText', {
                          'text-center': parseFloat(borderRadius) > 100,
                          'text-freeSlideFontSize': isPreview
                        })}
                        // onFontSizeChange={(val) => updateFontSize(content.id, 'text', val)}
                        fontSize={fontSizes && fontSizes[slide.id]?.text}
                        onHorizontalAlign={(val) => updateHorizontalAlign(content.id, 'text', val)}
                        horizontalAlign={horizontalAlignMap[content.id]?.text}
                      />
                    </div>
                    {isEditing && content.id === activeContentId && (
                      <div
                        ref={setBlockButtonRef(content.id)}
                        className="absolute -top-[20px] flex z-10"
                      >
                        <div
                          className={`relative ${menuPosition === 'top' ? 'top-[-160px]' : 'top-[20px]'}`}
                        >
                          <TextBlockActions
                            isOpen={isBlockOpen}
                            content={content}
                            deleteContent={handleDelete}
                            toggleContentBg={toggleContentBg}
                            setBorderRadius={handleBorderRadius}
                            setAlignVertical={handleVerticalAlign}
                            handleTitle={handleTitle}
                            mobile={isMobile}
                          />
                        </div>

                        <BaseButton
                          variant="secondary"
                          classNames="rounded-full size-12 p-0 shadow-xl"
                          onClick={handleOpenBlock}
                        >
                          <BookType />
                        </BaseButton>
                      </div>
                    )}
                  </div>
                </div>
              </Draggable>
            );
          }

          if (content.contentType === 'image') {
            return (
              <Draggable
                key={content.id}
                contentId={content.id}
                positionJson={content.position}
                containerRef={containerRef}
                isPreview={isPreview}
                onUpdatePosition={(posJson) => updateContentPosition(content.id, posJson)}
                borderRadius={borderRadius}
                isActive={content.id === activeContentId}
                onActivate={setActiveContentId}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              >
                <div
                  className="size-full overflow-hidden"
                  style={{ ...((!isPreview || isFullscreen) && { borderRadius }) }}
                >
                  <ImageComponent
                    className="size-full object-cover"
                    image={content?.image || ''}
                    isPreview={isPreview}
                    align={slide.accentImageAlign}
                    onTransform={handleImageTransform}
                    slideId={slide.id}
                    contentId={content.id}
                    keywords={slide.accentImageKeyword}
                    focusPointX={slide.focusPointX}
                    focusPointY={slide.focusPointY}
                    imageFit={slide.imageFit}
                    currentScale={slide.scale}
                    setBorderRadius={handleBorderRadius}
                  />
                </div>
              </Draggable>
            );
          }

          if (content.contentType === 'shape' && content.title) {
            const Shape = arrowShapeMap[content.title].component;

            return (
              <Draggable
                key={content.id}
                contentId={content.id}
                positionJson={content.position}
                containerRef={containerRef}
                isPreview={isPreview}
                minHeight={20}
                minWidth={20}
                onUpdatePosition={(posJson) => updateContentPosition(content.id, posJson)}
                borderRadius={borderRadius}
                isActive={content.id === activeContentId}
                onActivate={setActiveContentId}
                contentType={content.contentType}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="flex items-center justify-center w-full h-full">
                      <Shape className="w-32 h-32" fill={shapeColor} stroke={shapeColor} />
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-[200px]">
                    <ContextMenuItem
                      className="flex items-center gap-4 p-2"
                      onClick={() => handleDelete(content.id)}
                    >
                      <Trash />
                      {t('delete')}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Draggable>
            );
          }

          if (content.contentType === 'card') {
            return (
              <Draggable
                key={content.id}
                contentId={content.id}
                positionJson={content.position}
                containerRef={containerRef}
                isPreview={isPreview}
                minHeight={20}
                minWidth={20}
                onUpdatePosition={(posJson) => updateContentPosition(content.id, posJson)}
                borderRadius={borderRadius}
                isActive={content.id === activeContentId}
                onActivate={setActiveContentId}
                contentType={content.contentType}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              >
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      className="flex items-center justify-center w-full h-full bg-white overflow-hidden"
                      style={{ ...((!isPreview || isFullscreen) && { borderRadius }) }}
                    >
                      <CardComponent
                        key={`${content.id}_${content.sortOrder}`}
                        card={content}
                        variation={variation}
                        index={index}
                        totalCount={slide.content.length}
                        isPreview={isPreview}
                        onUpdateContent={(updatedItem) => updateContent?.(updatedItem, slide.id)}
                        slideId={slide.id}
                        forFreeSlide
                      />
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-[200px]">
                    <ContextMenuItem
                      className="flex items-center gap-4 p-2"
                      onClick={() => handleDelete(content.id)}
                    >
                      <Trash />
                      {t('delete')}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </Draggable>
            );
          }
        })}
      </div>
    </div>
  );
};

export default FreeSlide;
