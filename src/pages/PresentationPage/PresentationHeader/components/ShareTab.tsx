import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import EyeIcon from '@/assets/eye.svg?react';
import PrivateIcon from '@/assets/private.svg?react';
import PublicIcon from '@/assets/public.svg?react';
import CloseEyeIcon from '@/assets/close-eye.svg?react';
import { PresentationAccess } from '@/interfaces/IPresentation';
import { PresentationContext } from '@/contexts/Presentation.context';
import { cn } from '@/lib/utils';
import { IPresentation } from '@/interfaces/ISlides';
import presentationService from '@/api/presentationService';
import { AuthContext } from '@/providers/auth.provider';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import Tag from '@/components/CustomUI/Tag/Tag';
import { reversedLanguageMap } from '@/helpers/constants/languages.const';

interface ShareTabProps {
  readonly?: boolean;
  presentationData?: IPresentation;
}

const ShareTab = ({ readonly, presentationData }: ShareTabProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { onOpenChange } = useSubscriptionModal();
  const presentationContext = useContext(PresentationContext);
  const { hasActiveSubscription } = useContext(AuthContext);

  const [currentPresentation, setCurrentPresentation] = useState(
    presentationContext?.presentation || presentationData,
  );
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState<string>(currentPresentation?.accessPassword ?? '');
  const [selectedShareLanguage, setSelectedShareLanguage] = useState<string>('');
  const { lng } = useParams();

  const selectedPresentationLanguage = presentationContext?.presentation
    ? presentationContext.selectedLanguage
    : presentationData?.language;

  if (!selectedShareLanguage && selectedPresentationLanguage) {
    setSelectedShareLanguage(selectedPresentationLanguage);
  }

  const availableLanguages: string[] = currentPresentation?.translatedLanguages 
    ? [currentPresentation.language, ...currentPresentation.translatedLanguages].filter((lang): lang is string => Boolean(lang))
    : [currentPresentation?.language || selectedPresentationLanguage].filter((lang): lang is string => Boolean(lang));

  const presentationLink = currentPresentation?.alias
    ? `/${currentPresentation?.alias}?lang=${selectedShareLanguage || selectedPresentationLanguage}`
    : `?presentationId=${currentPresentation?.id}&lang=${selectedShareLanguage || selectedPresentationLanguage}`;
  const shareLink = `${window.location.origin}/${lng}/presentation${presentationLink}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const handleTogglePassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const isAlreadyPrivate =
    currentPresentation?.accessType !== undefined &&
    currentPresentation?.accessType === PresentationAccess.PRIVATE;

  const handleAccessChange = async (value: PresentationAccess) => {
    if (readonly) return;

    try {
      const updatedPresentation = {
        ...(presentationContext?.presentation || presentationData),
        accessType: value,
      } as IPresentation;
      setCurrentPresentation(updatedPresentation);

      await presentationService.updatePresentation(updatedPresentation);

      if (presentationData) {
        presentationData.accessType = value;
      }

      if (presentationContext?.updateAccessLevel) {
        presentationContext.updateAccessLevel(value);
      }
    } catch (error) {
      console.error('Error updating access level:', error);
    }
  };

  const handleAccessPasswordChange = async (value: string) => {
    setPasswordError(value.length < 3);
    setPassword(value);

    if (value.length >= 3) {
      try {
        const updatedPresentation = {
          ...(presentationContext?.presentation || presentationData),
          accessPassword: value,
        } as IPresentation;

        setCurrentPresentation(updatedPresentation);

        await presentationService.updatePresentation(updatedPresentation);

        if (presentationContext?.updateAccessPassword) {
          presentationContext.updateAccessPassword(value);
        }
      } catch (error) {
        console.error('Error updating password:', error);
        toast.error('Failed to update password');
      }
    }
  };

  return (
    <div className="flex w-full max-w-[516px] flex-col">
      <h3 className="my-4 text-[24px] font-bold text-darkHeadline">{t('share')}</h3>
      {!readonly && (
        <>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-darkHeadline">{t('generalAccess')}</p>
            <Select
              onValueChange={handleAccessChange}
              defaultValue={currentPresentation?.accessType}
            >
              <SelectTrigger className="flex w-max items-center gap-[5px] rounded-lg border-none bg-transparent transition-colors focus:ring-transparent focus-visible:ring-transparent active:ring-transparent [&>svg:last-of-type]:hidden [&_span.accessItemSubtitle]:hidden [&_span.accessItemTitle]:font-normal">
                <SelectValue placeholder={t(currentPresentation?.accessType ?? '')}></SelectValue>
              </SelectTrigger>
              <SelectContent className="p-2 [&>div]:p-0">
                <SelectGroup>
                  <SelectItem
                    value={PresentationAccess.PUBLIC}
                    className="data-[disabled]:opacity-1 mb-2 p-2 pr-10 text-sm leading-[16px] text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink"
                  >
                    <div className="flex items-center gap-2">
                      <PublicIcon />
                      <div className="flex flex-col gap-1">
                        <span className="accessItemTitle font-bold">{t('public')}</span>
                        <span className="accessItemSubtitle text-sm text-[#6b7280]">
                          {t('publicSubtitle')}
                        </span>
                      </div>
                    </div>
                  </SelectItem>

                  {hasActiveSubscription || isAlreadyPrivate ? (
                    <SelectItem
                      value={PresentationAccess.PRIVATE}
                      className="data-[disabled]:opacity-1 mb-2 p-2 pr-10 leading-[16px] text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover data-[disabled]:bg-lightGrey [&_svg]:size-6 [&_svg]:stroke-slushPink"
                    >
                      <div className="flex items-center gap-2">
                        <PrivateIcon />
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="accessItemTitle font-bold">{t('private')}</span>
                          <span className="accessItemSubtitle text-sm text-[#6b7280]">
                            {t('privateSubtitle')}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ) : (
                    <div
                      className="flex cursor-pointer items-center justify-between gap-2 p-2 text-sm text-darkText hover:bg-[#F6F7F8] active:bg-lightGreyHover"
                      onClick={onOpenChange}
                    >
                      <div className="flex items-center gap-2">
                        <PrivateIcon />
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="accessItemTitle font-bold">{t('private')}</span>
                          <span className="accessItemSubtitle text-sm text-[#6b7280]">
                            {t('privateSubtitle')}
                          </span>
                        </div>
                      </div>
                      <Tag
                        classNames="ml-4 py-[6px] px-2 text-[12px] leading-[12px] bg-[#BD9E60] rounded cursor-pointer"
                        onClick={onOpenChange}
                      >
                        {t('pro')}
                      </Tag>
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <p className="mb-2 text-[14px] text-darkText">
            {currentPresentation?.accessType === PresentationAccess.PRIVATE
              ? t('passwordProtected')
              : t('accessTip')}
          </p>

          {currentPresentation?.accessType === PresentationAccess.PRIVATE && (
            <>
              <div className="relative max-w-80">
                <Input
                  placeholder={t('password')}
                  type={isShowPassword ? 'text' : 'password'}
                  className={cn(
                    'h-10 text-darkHeadline disabled:opacity-100 disabled:cursor-text',
                    {
                      'border border-red': passwordError,
                    },
                  )}
                  value={password ?? ''}
                  onChange={(e) => handleAccessPasswordChange(e.target.value)}
                />
                <BaseButton
                  onClick={handleTogglePassword}
                  icon={isShowPassword ? <CloseEyeIcon /> : <EyeIcon />}
                  variant="ghost"
                  size="icon"
                  classNames="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-transparent active:bg-transparent focus:bg-transparent"
                />
                {passwordError && (
                  <p className="absolute text-[12px] text-red">{'At least 3 symbols'}</p>
                )}
              </div>
            </>
          )}
        </>
      )}

      {availableLanguages.length > 1 && (
        <div className="mt-4">
          <div className="mb-2">
            <p className="font-semibold text-darkHeadline">{t('language')}</p>
          </div>
          <Select
            onValueChange={setSelectedShareLanguage}
            value={selectedShareLanguage || selectedPresentationLanguage}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="capitalize">
                    {reversedLanguageMap[lang] || lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-4 flex w-full items-center justify-between rounded-lg bg-lightGrey p-4 pr-3">
        <p title={shareLink} className="line-clamp-1 w-full text-[#6b7280]">
          {shareLink}
        </p>
        <BaseButton variant="link" classNames="gradient-text p-0" onClick={handleCopy}>
          <Copy className="text-pink" /> {t('copyLink')}
        </BaseButton>
      </div>
    </div>
  );
};

export default ShareTab;
