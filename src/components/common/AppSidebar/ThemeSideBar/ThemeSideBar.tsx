import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PresentationContext } from '@/contexts/Presentation.context';
import { Trash2, Upload } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransitionOption from '@/assets/transition-option.svg?react';
import MessageIcon from '@/assets/message-circle-2.svg?react';
import InfoCircleIcon from '@/assets/info-circle.svg?react';
import PlayIcon from '@/assets/player-sound.svg?react';
import Tag from '@/components/CustomUI/Tag/Tag';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ShowInfoModal from '@/components/Modals/ShowInfoModal/ShowInfoModal';
import { AuthContext } from '@/providers/auth.provider';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { groupDataByField } from '@/helpers/utils/parsers';
import FontSelector from './Selectors/FontSelector';
import ThemeSelector from './Selectors/ThemeSelector';
import useMobile from '@/hooks/useMobile';
import { FeatureKey } from '@/interfaces/IUser';
import Hide from '@/components/services/Hide';
import TemplateSelector from './Selectors/TemplateSelector';

const ThemeSideBar = () => {
  const {
    toggleTheme,
    themes,
    extraThemes,
    theme,
    fontFamily,
    setFontFamily,
    presentationFonts,
    extraFonts,
    updateAuthorName,
    presentation,
    updatePresentationTitle,
    updatePresentationVoice,
    showPages,
    changeShowPages,
    handleFileChange,
    tempUrl,
    removeLogo,
    voices,
    isVoicesLoading,
    showAgenda,
    changeShowAgenda,
    showEndScreen,
    changeShowEndScreen,
    transitionOptions,
    slideTransition,
    setSlideTransition,
    showTitle,
    changeShowTitle,
    showWatermark,
    changeShowWatermark,
    template,
    toggleTemplate,
    selectedLanguage
  } = useContext(PresentationContext);
  const { featuresAccess } = useContext(AuthContext);
  const { onOpenChange } = useSubscriptionModal();
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [isOpenVoicesDropdown, setIsOpenVoicesDropdown] = useState(false);
  const { user } = useContext(AuthContext);
  const [isVoiceOverInfoOpen, setIsVoiceOverInfoOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');

  const handleToggleDropdown = () => {
    if (!featuresAccess[FeatureKey.VOICE_FEATURE].hasAccess && !presentation?.voiceId) {
      onOpenChange();
    } else {
      setIsOpenVoicesDropdown((prev) => !prev);
    }
  };

  const handleShowVoiceOverInfo = () => {
    setIsVoiceOverInfoOpen((prev) => !prev);
  };

  const handleVoicePreview = () => {
    if (selectedVoice) {
      const selectedPrevew = voices.find((voice) => voice.id === selectedVoice);

      if (selectedPrevew) {
        const audio = new Audio(selectedPrevew.previewUrl);
        audio.play();
      }
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    updatePresentationVoice(voiceId);
    setSelectedVoice(voiceId);
  };

  useEffect(() => {
    if (!selectedVoice && presentation?.voiceId) {
      setSelectedVoice(presentation?.voiceId);
    }
  }, [presentation?.voiceId]);

  return (
    <div className="mt-4 flex flex-col gap-7">
      {/* Themes */}
      <TemplateSelector template={template} toggleTemplate={toggleTemplate} />

      {/* Color Schema */}
      <ThemeSelector
        theme={theme}
        toggleTheme={toggleTheme}
        extraThemes={extraThemes}
        themesDefault={themes}
        template={presentation?.template}
      />

      {/* Style Fonts */}
      <FontSelector
        fontFamily={fontFamily}
        template={template}
        setFontFamily={setFontFamily}
        presentationFonts={presentationFonts}
        extraFonts={extraFonts}
      />

      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-[500] uppercase">{t('transition')}</p>
        <Select onValueChange={setSlideTransition} value={slideTransition}>
          <SelectTrigger className="h-10">
            <div className="flex items-center gap-3">
              <TransitionOption />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent align="start" className="w-full">
            {transitionOptions?.map((option) => (
              <SelectItem className="w-full" key={option.value} value={option.value}>
                <div className={`flex gap-2`}>{t(option.label)}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logotype */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-[500] uppercase">{t('logotype')}</p>
        <div className="relative cursor-pointer rounded-lg p-2 text-darkText outline-dashed outline-2 outline-lightGreyPress hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover">
          <Input
            accept=".png, .jpg, .jpeg, .webp"
            id="picture"
            type="file"
            className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
            onChange={handleFileChange}
          />
          {tempUrl ? (
            <img src={tempUrl} />
          ) : (
            <div className="flex cursor-pointer justify-center gap-3">
              <p className="text-[14px] font-semibold">{t('upload')}</p>
              <Upload className="size-5" />
            </div>
          )}
        </div>
        {tempUrl && (
          <Button variant="outline" onClick={removeLogo}>
            {t('remove')}
            <Trash2 className="ms-3" />
          </Button>
        )}
      </div>

      {/* Voice Over */}
      <Hide environments={['prod']}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm uppercase">
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2 text-[12px] font-[500] uppercase">
                {t('voiceOver')}
                {!featuresAccess[FeatureKey.VOICE_FEATURE].hasAccess && (
                  <Tag
                    classNames={
                      'py-[6px] px-2 text-[12px] leading-[12px] bg-[#BD9E60] rounded cursor-pointer'
                    }
                    onClick={onOpenChange}
                  >
                    {t('pro')}
                  </Tag>
                )}
              </span>

              <BaseButton
                icon={<InfoCircleIcon />}
                onClick={handleShowVoiceOverInfo}
                variant="ghost"
                size="sm"
                classNames="p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Select
              onValueChange={handleVoiceChange}
              value={presentation?.voiceId ?? ''}
              onOpenChange={handleToggleDropdown}
              open={isOpenVoicesDropdown}
            >
              <SelectTrigger loading={isVoicesLoading}>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-1">
                      <MessageIcon />
                      {t('chooseVoice')}
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent align="start" className="w-full">
                {Object.entries(groupDataByField(voices, 'gender')).map(([groupName, voices]) => (
                  <div key={groupName}>
                    <SelectGroup>
                      <SelectLabel>{t(groupName)}</SelectLabel>
                      {voices.map((voice) => (
                        <SelectItem className="w-full" key={voice.id} value={voice.id}>
                          <div className="flex gap-1">{voice.name}</div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                  </div>
                ))}
              </SelectContent>
            </Select>
            {featuresAccess[FeatureKey.VOICE_FEATURE].hasAccess && presentation?.voiceId &&
              <BaseButton
                disabled={isVoicesLoading}
                icon={<PlayIcon />}
                onClick={handleVoicePreview}
                variant="ghost"
                size="sm"
                classNames="hover:bg-transparent active:bg-transparent focus:bg-transparent"
              />
            }
          </div>
        </div>
      </Hide>

      {/* Presentation Title */}
      {isMobile && (
        <div className="flex flex-col gap-3">
          <p className="text-[12px] font-[500] uppercase">{t('presentationTitle')}</p>
          <Input
            className="font-[500]"
            value={presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? ''}
            onChange={(e) => updatePresentationTitle(e.target.value)}
          />
        </div>
      )}

      {/* Author Name */}
      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-[500] uppercase">{t('author')}</p>
        <Input
          className="font-[500]"
          value={presentation?.authorName}
          onChange={(e) => updateAuthorName(e.target.value)}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-4">
        {/* Page Number */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pages">{t('showPages')}</Label>
          <Switch id="pages" checked={showPages} onCheckedChange={changeShowPages} />
        </div>

        {/* Watermark */}
        <div className="flex items-center justify-between">
          <Label htmlFor="watermark">{t('watermark')}</Label>
          <Switch
            id="watermark"
            checked={showWatermark}
            onCheckedChange={changeShowWatermark}
            disabled={user?.subscription?.ownedSubscription?.status !== 'active'}
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pages">{t('showTitle')}</Label>
          <Switch id="pages" checked={showTitle} onCheckedChange={changeShowTitle} />
        </div>

        {/* Agenda */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pages">{t('showAgenda')}</Label>
          <Switch id="pages" checked={showAgenda} onCheckedChange={changeShowAgenda} />
        </div>

        {/* End Screen */}
        <div className="flex items-center justify-between">
          <Label htmlFor="pages">{t('endScreen')}</Label>
          <Switch id="pages" checked={showEndScreen} onCheckedChange={changeShowEndScreen} />
        </div>
      </div>

      {/* Voice Over Modal */}
      <ShowInfoModal
        isOpen={isVoiceOverInfoOpen}
        onOpenChange={handleShowVoiceOverInfo}
        description={t('voiceOverInfoDescription')}
        title={t('voiceOver')}
      />
    </div>
  );
};

export default ThemeSideBar;
