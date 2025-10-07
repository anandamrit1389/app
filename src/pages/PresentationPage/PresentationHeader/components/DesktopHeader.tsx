import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import InabitLogoColor from '@/assets/logo-inabit-color.svg?react';
import { useTranslation } from 'react-i18next';
import ThemeSwitch from '@/assets/theme-switch.svg?react';
// import DesktopIcon from "@/assets/device-desktop.svg?react";
// import MobileIcon from "@/assets/device-mobile.svg?react";
import Export from '@/assets/export.svg?react';
import DownloadIcon from '@/assets/download.svg?react';
import { useContext, useEffect, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
// import IconToggle from "@/components/CustomUI/IconToggle/IconToggle";
import { Redo2, Share, Undo2 } from 'lucide-react';
import { AuthContext } from '@/providers/auth.provider';
import LoaderDark from '@/assets/loader-dark.svg?react';
import CheckIcon from '@/assets/check-copy.svg?react';
import { useNavigate } from 'react-router-dom';
import { setPresentationIdForCopyToStorage } from '@/helpers/utils/storage';
import { Input } from '@/components/ui/input';
import useScreenSize from '@/hooks/useScreenSize';
import HeaderActions from './HeaderActions';

interface IProps {
  setExportOpen: () => void;
  setShareOpen: () => void;
}

// const toggleItems = [
//   {
//     id: "desktop",
//     icon: <DesktopIcon />,
//   },
//   {
//     id: "mobile",
//     icon: <MobileIcon />,
//   },
// ];

const DesktopHeader = ({ setExportOpen, setShareOpen }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const navigate = useNavigate();
  const screenSize = useScreenSize();

  const {
    showSideBar,
    present,
    readonly,
    presentation,
    handleUndoAction,
    handleRedoAction,
    historyIndex,
    history,
    handleCopyPresentation,
    loading,
    isCopied,
    updatePresentationTitle,
    selectedLanguage,
  } = useContext(PresentationContext);
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');

  const isGenerating = !presentation?.generationFinished;

  const logoLink = presentation?.workspace === 'team' ? '/dashboard/team' : '/dashboard';

  useEffect(() => {
    const t = setTimeout(() => {
      if (title) {
        updatePresentationTitle(title);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [title]);

  const copyPresentation = async (presentationId?: string) => {
    if (!presentationId) return;

    if (user) {
      handleCopyPresentation(presentationId);
    } else {
      setPresentationIdForCopyToStorage(presentationId, selectedLanguage);
      navigate('/login');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTitle =
        presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? '';
      setTitle(newTitle);
    }, 200);

    return () => clearTimeout(timer);
  }, [presentation?.title, presentation?.titleTranslations?.[selectedLanguage], selectedLanguage]);

  return (
    <div className="relative z-10 flex h-16 items-center justify-between border-b border-b-black/[0.1] bg-white p-2 px-5 py-3 transition-opacity">
      <div className="flex w-full items-center">
        <LocaleLink to={logoLink}>
          <InabitLogoColor className="cursor-pointer" />
        </LocaleLink>
        <Input
          className="mx-3 max-w-[370px] truncate border-0 font-[500] focus:border"
          style={{
            width: `${Math.max(title ? title?.length + 1 : (presentation?.titleTranslations?.[selectedLanguage]?.length ?? presentation?.title?.length ?? 0) + 1, 8)}ch`,
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={readonly}
        />
        {!readonly && (
          <>
            <BaseButton
              variant="ghost"
              onClick={handleUndoAction}
              classNames="p-2"
              disabled={historyIndex === 1 || historyIndex === 0}
            >
              <Undo2 className="size-5 text-darkText" />
            </BaseButton>
            <BaseButton
              variant="ghost"
              onClick={handleRedoAction}
              classNames="p-2"
              disabled={
                !history || history?.length < 1 || historyIndex === (history?.length ?? 0) - 1
              }
            >
              <Redo2 className="size-5 text-darkText" />
            </BaseButton>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {readonly && (
          <BaseButton
            variant="ghost"
            onClick={() => copyPresentation(presentation?.id)}
            classNames="font-[500] gap-0 h-8 px-3"
            loading={loading}
            loader={
              <div className="animate-spin">
                <LoaderDark />
              </div>
            }
            disabled={isCopied}
          >
            {isCopied ? (
              <>
                <CheckIcon className="me-2 w-[20px]" />
                {t('copied')}
              </>
            ) : (
              <>
                <DownloadIcon className="me-2 w-[20px]" />
                {t('saveToPresentations')}
              </>
            )}
          </BaseButton>
        )}

        {!readonly && screenSize > 1100 && (
          <>
            <BaseButton
              variant="ghost"
              onClick={() => setShareOpen()}
              classNames="font-[500] gap-0 h-8 px-3"
              disabled={isGenerating}
            >
              <Share className="me-2 w-[20px]" /> {t('share')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              onClick={() => setExportOpen()}
              classNames="font-[500] gap-0 h-8 px-3"
              disabled={isGenerating}
            >
              <Export className="me-2 w-[20px]" /> {t('export')}
            </BaseButton>
            <BaseButton
              variant="ghost"
              classNames="font-[500] gap-0 h-8 px-3"
              onClick={() => showSideBar('theme')}
              disabled={isGenerating}
            >
              <ThemeSwitch className="me-2 w-[20px]" /> {t('theme')}
            </BaseButton>
            {/* <div
              className={`px-1.5, me-2 ${
                isGenerating && "pointer-events-none opacity-70"
              }`}
            >
              <IconToggle
                items={toggleItems}
                isToggled={isDesktopMode}
                onToggle={handleToggleDevice}
              />
            </div> */}
          </>
        )}

        {!readonly && screenSize <= 1100 && (
          <HeaderActions
            setExportOpen={setExportOpen}
            setShareOpen={setShareOpen}
            isGenerating={isGenerating}
          />
        )}

        <BaseButton
          onClick={present}
          classNames="text-white h-8 px-3 bg-[#111827] hover:bg-[#374151] focus:bg-[#030712]"
          disabled={isGenerating}
        >
          {t('presentMode')}
        </BaseButton>
      </div>
    </div>
  );
};

export default DesktopHeader;
