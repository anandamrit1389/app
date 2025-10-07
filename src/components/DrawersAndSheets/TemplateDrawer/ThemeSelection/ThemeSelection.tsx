import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext, useEffect, useMemo } from 'react';
import { getTemplate, getTemplates } from '@/helpers/constants/presentation-templates.const';
import classNames from 'classnames';
import SlideFactory from '@/components/PresentationEditor/SlideFactory/SlideFactory';
import FontSelector from '@/components/common/AppSidebar/ThemeSideBar/Selectors/FontSelector';
import { presentationFonts } from '@/helpers/constants/fonts.const';
import ThemeSelector from '@/components/common/AppSidebar/ThemeSideBar/Selectors/ThemeSelector';
import { defaultThemes } from '@/helpers/constants/themes.const';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth.provider';
import { ThemeSchema } from '@/interfaces/theme.interface';
import { FontScheme } from '@/interfaces/font.interface';
import { getFontScheme } from '@/helpers/utils/fonst';
import { ITemplate } from '@/interfaces/ISlides';
import DrawerHeader from '../../DrawerHeader/DrawerHeader';
import MainContainer from '@/components/Containers/MainContainer';
import TemplatePreview from '@/components/Templates/TemplatePreview';
import TemplateSelector from '@/components/common/AppSidebar/ThemeSideBar/Selectors/TemplateSelector';
import { PromptPageContext } from '@/contexts/PromptPage.context';

const ThemeSelection = () => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { companyMembershipInfo, user } = useContext(AuthContext);
  const {
    setStep,
    template,
    theme,
    font,
    setFont,
    setTheme,
    setTemplate,
    authorName,
    setAuthorName,
    showPages,
    setShowPages,
    showWatermark,
    setShowWatermark,
    handleStartWithTemplate,
    showEndScreen,
    setShowEndScreen,
    textAmount,
  } = useContext(PromptPageContext);

  const templateToRender = useMemo(() => {
    const all = getTemplates();

    return all.find((t) => template === t.templateKey);
  }, [template]);

  useEffect(() => {
    const newTemplate = getTemplate(template);
    if (newTemplate) {
      setTheme(newTemplate.themeId);
      setFont(newTemplate.fontFamily);
    }
  }, [template]);

  const slidesToRender = getSlidesPreviews(templateToRender, textAmount);

  const extraThemes: ThemeSchema[] =
    companyMembershipInfo && companyMembershipInfo?.themeId && companyMembershipInfo.themeColors
      ? [
          {
            id: companyMembershipInfo?.themeId ?? '',
            colors: companyMembershipInfo.themeColors,
          } as ThemeSchema,
        ]
      : [];

  const extraFonts: FontScheme[] =
    companyMembershipInfo?.companyFonts && companyMembershipInfo?.fontId
      ? [getFontScheme(companyMembershipInfo?.companyFonts, companyMembershipInfo?.fontId)]
      : [];

  return (
    <MainContainer>
      <div className={cn('w-full h-full ', { 'overflow-y-auto': isMobile })}>
        <DrawerHeader
          title={templateToRender?.title}
          nextBtnText={t('outlineReview')}
          onPrevClick={() => setStep('template')}
          onNextClick={handleStartWithTemplate}
        />
        <div
          className={cn('flex w-full pt-4 md:pt-6', {
            'flex-col': isMobile,
            'h-[90%]': !isMobile,
          })}
        >
          <div
            className={cn('h-[95%] w-8/12 flex justify-center', {
              'size-full': isMobile,
            })}
          >
            <div className="relative size-full flex flex-row gap-4">
              {templateToRender &&
                slidesToRender?.map((slide, index) => (
                  <div
                    key={index}
                    className={classNames('', {
                      'w-9/12 ': isMobile,
                      'w-9/12 absolute': !isMobile,
                      'top-0 left-0 z-10': index === 0 && !isMobile,
                      'right-0 top-1/2 z-20': index === 1 && !isMobile,
                    })}
                  >
                    <div className="relative">
                      <div className="flex h-full justify-start">
                        <TemplatePreview isMobile={isMobile} theme={theme} font={font}>
                          <SlideFactory slide={slide} isPreview />
                        </TemplatePreview>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div
            className={cn('flex justify-center md:justify-end h-full w-4/12 ml-auto', {
              'w-full p-0 pb-16': isMobile,
            })}
          >
            <div
              className={cn(
                'bg-lightGrey w-full md:w-[320px] h-fit rounded-xl p-4 flex flex-col gap-6 pb-8 ',
                { 'bg-white mt-10': isMobile },
              )}
            >
              <TemplateSelector template={template} toggleTemplate={setTemplate} />
              <ThemeSelector
                theme={theme}
                toggleTheme={setTheme}
                themesDefault={defaultThemes}
                extraThemes={extraThemes}
                template={template}
              />
              <FontSelector
                fontFamily={font}
                template={template}
                setFontFamily={setFont}
                presentationFonts={presentationFonts}
                extraFonts={extraFonts}
              />

              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-[500] uppercase">{t('author')}</p>
                <Input
                  className="font-[500]"
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pages">{t('showPages')}</Label>
                <Switch
                  id="pages"
                  checked={showPages}
                  onCheckedChange={() => {
                    setShowPages(!showPages);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="watermark">{t('watermark')}</Label>
                <Switch
                  id="watermark"
                  checked={showWatermark}
                  onCheckedChange={() => {
                    setShowWatermark(!showWatermark);
                  }}
                  disabled={user?.subscription?.ownedSubscription?.status !== 'active'}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pages">{t('endScreen')}</Label>
                <Switch
                  id="pages"
                  checked={showEndScreen}
                  onCheckedChange={() => {
                    setShowEndScreen(!showEndScreen);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {isMobile && (
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-2xl">
            <BaseButton onClick={handleStartWithTemplate} classNames="h-12 w-full font-normal">
              {t('startWith')}
            </BaseButton>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default ThemeSelection;

const getSlidesPreviews = (template?: ITemplate, textAmount?: string) => {
  if (!template) {
    return [];
  }

  switch (textAmount) {
    case 'keynote':
      return template.slides.filter(
        (s) => s.slideType === 'image-caption-slide' || s.slideType === 'image-text-slide',
      );
    case 'inspirational':
      return template.slides.filter(
        (s) => s.slideType === 'image-caption-slide' || s.slideType === 'image-text-slide',
      );
    case 'business':
      return template.slides
        .filter((s) => s.slideType === 'image-caption-slide' || s.slideType === 'image-text-slide')
        .map((s) =>
          s.slideType === 'image-caption-slide' ? { ...s, variation: 'bottomWithout' } : s,
        );
    case 'academic':
      return template.slides.filter(
        (s) => s.slideType === 'image-caption-slide' || s.slideType === 'image-text-slide',
      );
  }
};
