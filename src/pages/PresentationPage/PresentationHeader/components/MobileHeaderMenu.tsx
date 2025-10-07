import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import DoorExit from '@/assets/door-exit.svg?react';
import { PlusIcon, Share, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import InabitLogoColor from '@/assets/logo-inabit-color.svg?react';
import DownloadIcon from '@/assets/download.svg?react';
import CheckIcon from '@/assets/check-copy.svg?react';
import LoaderDark from '@/assets/loader-dark.svg?react';
import ThemeSwitch from '@/assets/theme-switch.svg?react';
import Export from '@/assets/export.svg?react';
import { setPresentationIdForCopyToStorage } from '@/helpers/utils/storage';
import { useNavigate } from 'react-router-dom';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext } from 'react';
import { useMemo } from 'react';

interface IProps {
  menuOpen: boolean;
  setMenuOpen: () => void;
  setAddNewOpen: () => void;
  showSideBar: (type: string) => void;
  setExportOpen: () => void;
  readonly: boolean;
  setShareOpen: () => void;
}

const MobileHeaderMenu = ({
  menuOpen,
  setMenuOpen,
  setAddNewOpen,
  showSideBar,
  setExportOpen,
  readonly,
  setShareOpen,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const navigate = useNavigate();
  const { presentation, handleCopyPresentation, isCopied, loading, selectedLanguage } =
    useContext(PresentationContext);

  const hasReachedMaxSlides = useMemo(() => {
    if (!presentation?.slides) return false;

    const regularSlides = presentation.slides.filter(
      (slide) => !['content-slide', 'closing-slide'].includes(slide.slideType),
    ).length;

    return regularSlides >= 30;
  }, [presentation?.slides]);

  const copyPresentation = async (presentationId?: string) => {
    if (!presentationId) return;

    if (readonly) {
      handleCopyPresentation(presentationId);
    } else {
      setPresentationIdForCopyToStorage(presentationId, selectedLanguage);
      navigate('/login');
    }
  };

  return (
    <Sheet open={menuOpen} onOpenChange={() => setMenuOpen()}>
      <SheetContent
        outsideclose="true"
        side="left"
        className="flex h-dvh w-10/12 flex-col justify-between bg-white p-0"
      >
        <div>
          <div className="flex w-full items-center justify-between p-4">
            <LocaleLink to="/dashboard">
              <InabitLogoColor className="cursor-pointer" />
            </LocaleLink>
            <div className="absolute -right-[45px] top-8">
              <BaseButton
                onClick={() => setMenuOpen()}
                classNames="transition-all absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-lightGrey rounded-full p-1 hover:opacity-[0.9] md:hidden"
              >
                <X className="size-5 text-black" />
              </BaseButton>
            </div>
            {!readonly && (
              <BaseButton
                classNames="w-fit py-2"
                variant="outline"
                onClick={() => setAddNewOpen()}
                disabled={hasReachedMaxSlides}
              >
                <PlusIcon /> {t('addSlide')}
              </BaseButton>
            )}
          </div>
          <div className="flex gap-2">
            {readonly && (
              <BaseButton
                variant="ghost"
                onClick={() => copyPresentation(presentation?.id)}
                classNames="font-[500] gap-0 h-8 px-3 mt-2"
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
          </div>
          <div className="w-full">
            <SheetTitle className="hidden">{t('presentationMenu')}</SheetTitle>
            {!readonly && (
              <>
                <BaseButton
                  variant="ghost"
                  onClick={() => showSideBar('theme')}
                  classNames="w-full justify-start"
                >
                  <ThemeSwitch className="me-3 w-[20px]" /> {t('theme')}
                </BaseButton>
                <BaseButton
                  classNames="w-full justify-start"
                  variant="ghost"
                  onClick={() => setExportOpen()}
                >
                  <Export className="me-3 w-[20px]" /> {t('export')}
                </BaseButton>
                <BaseButton
                  classNames="w-full justify-start"
                  variant="ghost"
                  onClick={() => setShareOpen()}
                >
                  <Share className="me-3 w-[20px]" /> {t('share')}
                </BaseButton>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 p-4">
          <LocaleLink to="/dashboard">
            <BaseButton classNames="w-full px-3 py-2" variant="outline">
              <DoorExit /> {t('exitToDashboard')}
            </BaseButton>
          </LocaleLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileHeaderMenu;
