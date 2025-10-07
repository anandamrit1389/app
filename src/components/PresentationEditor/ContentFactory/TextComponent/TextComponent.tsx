import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import AIStar from '@/assets/ai-stars-1.svg?react';
import AIstars from '@/assets/ai-stars.svg?react';
import presentationService from '@/api/presentationService';
import TextActions from './TextActions';
import useMobile from '@/hooks/useMobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { PresentationContext } from '@/contexts/Presentation.context';
import { CreditAction } from '@/interfaces/IPricing';
import CreditCost from '@/components/CreditCost/CreditCost';
import BtnGenerate from '@/assets/btn-generate.svg?react';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';
import useViewportSize from '@/hooks/useViewportSize';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { getFontSizeInPixels } from '@/helpers/utils/fonst';
import { ChartType } from '../../SlideFactory/Slides/ChartSlide';
import CreditsLeft from '@/components/CreditCost/CreditsLeft';
import { useCredits } from '@/hooks/useCredits';

interface IProps {
  content?: string;
  contentId?: string;
  className?: string;
  isPreview?: boolean;
  showPromActions?: boolean;
  onUpdate?: (val: string) => void;
  onActions?: (val: boolean) => void;
  chartSlide?: boolean;
  disabled?: boolean;
  onFontSizeChange?: (val: number) => void;
  fontSize?: number;
  chartType?: ChartType;
  onHorizontalAlign?: (val: string) => void;
  horizontalAlign?: string;
  onEdit?: (val: boolean) => void;
  placeholder?: string;
}

const TextComponent = ({
  content,
  contentId,
  className,
  isPreview,
  showPromActions = true,
  onUpdate,
  onActions,
  chartSlide = false,
  disabled = false,
  onFontSizeChange,
  fontSize,
  chartType,
  onHorizontalAlign,
  horizontalAlign,
  onEdit,
  placeholder,
}: IProps) => {
  const formatChartText = (text: string | undefined) => {
    if (!text) return null;

    let parts = text.split('\n');

    if (parts.length < 2) {
      parts = text.replace('X-AXIS =', '\nX-AXIS =').split('\n');
    }

    let sourceUrl = '';

    for (let i = 1; i < parts.length; i++) {
      const urlMatch = parts[i].match(/(https?:\/\/[^\s\]]+)/);
      if (urlMatch) {
        sourceUrl = urlMatch[0];
        parts[i] = parts[i]
          .replace(urlMatch[0], '')
          .replace(/Source:\s*$/i, '')
          .replace(/\s*Source:\s*/i, '')
          .trim();
        break;
      }
    }

    const isPieOrDonut = chartType === 'pie-chart' || chartType === 'donut-chart';

    return (
      <div className="flex flex-col gap-content mt-bulletPointAlign">
        {!isPieOrDonut && (parts[0] || parts[1]) && (
          <textarea
            readOnly
            className="w-full h-auto resize-none bg-transparent border-none focus:outline-none"
            value={[parts[0], parts[1]].filter(Boolean).join('\n')}
          />
        )}
        {sourceUrl && (
          <p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              Source
            </a>
          </p>
        )}
      </div>
    );
  };

  const {
    isSideBarActive,
    activeSlide,
    onHideSelectedText,
    selectedText,
    theme,
    selectedLanguage,
    isFullscreen,
  } = useContext(PresentationContext);

  const currentTheme = themeCatalog[theme as keyof typeof themeCatalog];
  const isDark = currentTheme?.templates.includes('dark');

  const credits = useCredits();
  const isMobile = useMobile();
  const viewportSize = useViewportSize();
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('top');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>('');
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [isContentTooLong, setIsContentTooLong] = useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const promptContainerRef = useRef<HTMLDivElement>(null);

  const newFontSize =
    fontSize && getFontSizeInPixels(fontSize, isMobile, isSideBarActive, isFullscreen);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (inputRef.current && userAgent.indexOf('Chrome') === -1) {
      inputRef.current.style.height = '0px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
    return () => {
      setIsOpen(false);
    };
  }, [content, isEditing, isSideBarActive, activeSlide]);

  useEffect(() => {
    onEdit?.(isEditing);
  }, [isEditing]);

  useEffect(() => {
    const handleResize = () => {
      const userAgent = navigator.userAgent;

      if (inputRef.current && userAgent.indexOf('Chrome') === -1) {
        inputRef.current.style.height = '0px';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (content) {
      const characterCount = content.length;
      setIsContentTooLong(characterCount > 200);
    }
  }, [content]);

  useEffect(() => {
    setHideButton(true);

    const t = setTimeout(() => {
      setHideButton(false);
    }, 500);

    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    onActions?.(isEditing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const handleClick = () => {
    if (!isPreview || !disabled) {
      setIsEditing(true);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate?.(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      buttonRef.current?.contains(e.relatedTarget) ||
      promptContainerRef.current?.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    setIsEditing(false);
    setShowPromptInput(false);
  };

  const handleActions = (event: React.MouseEvent) => {
    window.innerHeight / 2 < event.clientY ? setMenuPosition('top') : setMenuPosition('bottom');
    setIsOpen(true);
  };

  const handleRegenerateText = async (variant: string) => {
    if (variant === 'regenerate') {
      setShowPromptInput(true);
      setIsOpen(false);

      return;
    }

    if (variant === 'free-slide') {
      setIsOpen(false);
      setIsEditing(false);

      return;
    }

    setShowPromptInput(false);
    setLoading(true);
    const data = await presentationService.generateNewText(
      content ?? '',
      variant,
      selectedLanguage,
    );

    if (data) {
      onUpdate?.(data);
      if (!isMobile) {
        setIsOpen(false);
        setIsEditing(false);
      }
    }

    setLoading(false);
  };

  if (isMobile) {
    return (
      <>
        <p
          className={`${className} ${horizontalAlign || ''}`}
          style={{
            ...(fontSize && { fontSize: `${newFontSize}px` }),
            userSelect: 'none',
          }}
          onClick={handleClick}
        >
          {chartSlide ? formatChartText(content) : content}
        </p>

        <Sheet open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <SheetContent
            outsideclose="true"
            side="right"
            className="flex h-dvh w-full flex-col items-start justify-start bg-lightGrey p-0"
          >
            <Button variant={'ghost'} className="mt-3" onClick={() => setIsEditing(false)}>
              <ArrowBack />
            </Button>
            <SheetTitle className="hidden">{t('input')}</SheetTitle>

            <textarea
              ref={inputRef}
              value={content}
              onChange={handleTitleChange}
              className="size-full bg-transparent p-5 font-bold text-darkHeadline outline-none"
              disabled={disabled}
            />

            <Sheet open={showPromptInput} onOpenChange={() => setShowPromptInput(false)}>
              <SheetContent
                outsideclose="true"
                side="bottom"
                className={`align-start flex h-dvh w-full flex-col justify-start bg-lightGrey p-0`}
              >
                <div
                  style={{ height: viewportSize?.[1] }}
                  className="flex w-full flex-col justify-start p-4 align-top"
                >
                  <SheetTitle className="hidden">{t('input')}</SheetTitle>

                  <div className="flex w-full justify-between">
                    <Button
                      variant={'ghost'}
                      className="ps-0"
                      onClick={() => setShowPromptInput(false)}
                    >
                      <ArrowBack />
                    </Button>
                  </div>

                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && promptInput) {
                        handleRegenerateText(promptInput);
                      }
                    }}
                    className="mb-4 h-full bg-transparent p-4 font-bold text-darkHeadline outline-none"
                  />

                  <BaseButton
                    loading={loading}
                    onClick={() => handleRegenerateText(promptInput)}
                    classNames="font-semibold h-10"
                    disabled={!promptInput}
                  >
                    <AIstars className="size-5" /> {t('generateText')}
                    <CreditCost
                      action={CreditAction.ADJUST_TEXT}
                      icon={<CoinFilledWhite />}
                      containerClassName={`border-l border-l-lightGrey/30`}
                      costClassName={`text-lightGrey`}
                    />
                  </BaseButton>
                </div>
              </SheetContent>
            </Sheet>

            <TextActions
              mobile
              isOpen
              onSelectVariant={handleRegenerateText}
              isContentTooLong={isContentTooLong}
              onFontSizeChange={onFontSizeChange}
              fontSize={fontSize}
              onHorizontalAlign={onHorizontalAlign}
              isEmpty={!content?.length}
            />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  if (!isPreview) {
    const padding = className?.includes('text-title') ? 20 : 0;
    return (
      <>
        <div className={`${className} relative !m-0 flex !p-0`} onBlur={handleBlur}>
          {!loading && (
            <>
              {selectedText && selectedText === content ? (
                <textarea
                  className={`h-max max-h-[70vh] w-full overflow-hidden ${isDark ? 'bg-white/50' : 'bg-black/50'} ${className} bg-normalText text-titleBg`}
                  onClick={onHideSelectedText}
                >
                  {chartSlide ? formatChartText(content) : content}
                </textarea>
              ) : chartSlide ? (
                <div>{formatChartText(content)}</div>
              ) : (
                <textarea
                  onClick={handleClick}
                  rows={1}
                  style={{
                    backgroundColor: 'transparent',
                    resize: 'none',
                    width: '100%',
                    ...(!className?.includes('p-') && { padding }),
                    ...(fontSize && { fontSize: `${newFontSize}px` }),
                  }}
                  className={`overflow-on-text max-h-[70vh] ${horizontalAlign || ''} ${
                    isEditing
                      ? 'rounded-sm outline outline-1 outline-offset-8 outline-grey/25'
                      : 'outline-none'
                  } ${className}`}
                  value={content}
                  onChange={handleTitleChange}
                  ref={inputRef}
                  disabled={disabled}
                  placeholder={placeholder}
                />
              )}
            </>
          )}
          {loading && <Skeleton className={`h-8 w-full`} />}
          <div
            ref={buttonRef}
            className={`absolute flex -top-[60px] z-[9999999] transition-opacity duration-200 ${
              showPromActions && isEditing && !loading && !hideButton && !showPromptInput
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className={`relative ${menuPosition === 'top' ? 'top-[-100px]' : 'top-[20px]'}`}>
              <TextActions
                isOpen={isOpen}
                onSelectVariant={handleRegenerateText}
                isContentTooLong={isContentTooLong}
                onFontSizeChange={onFontSizeChange}
                fontSize={fontSize}
                contentId={contentId}
                onHorizontalAlign={onHorizontalAlign}
                isEmpty={!content?.length}
              />
            </div>
            <BaseButton
              variant="secondary"
              classNames="rounded-full size-12 p-0 shadow-xl"
              onClick={handleActions}
              tabIndex={0}
            >
              <AIStar className='aiStar' />
            </BaseButton>
          </div>
          {showPromptInput && (
            <>
              <div
                ref={promptContainerRef}
                className="absolute -top-[80px] flex items-center rounded-full bg-white p-1 ps-4 shadow-lg z-50 prompt-input-container"
              >
                <AIStar className="size-10" />
                <Input
                  autoFocus
                  className="rounded-none border-0 text-[#505050] outline-none outline-0 focus-visible:ring-0 min-w-[160px] tracking-normal"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && promptInput) {
                      handleRegenerateText(promptInput);
                    }
                  }}
                />
                <div className="h-8 border-l border-l-lightGrey"></div>
                <BaseButton
                  variant="default"
                  classNames="rounded-full p-2"
                  disabled={!promptInput}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerateText(promptInput);
                  }}
                >
                  <BtnGenerate className="size-5" />
                  <CreditCost
                    action={CreditAction.ADJUST_TEXT}
                    icon={<CoinFilledWhite />}
                    containerClassName="border-l border-l-lightGrey/30"
                    costClassName="text-lightGrey"
                  />
                </BaseButton>
              </div>
              <div className="absolute -top-[25px] left-[200px] text-right">
                <CreditsLeft credits={credits} />
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <p
      className={`${className} ${horizontalAlign || ''}`}
      onClick={handleClick}
      style={{ ...(fontSize && isFullscreen && { fontSize: `${newFontSize}px` }) }}
    >
      {chartSlide
        ? formatChartText(content)
        : content?.split('\n').map((line, idx) => (
            <Fragment key={idx}>
              {line}
              <br />
            </Fragment>
          ))}
    </p>
  );
};

export default TextComponent;
