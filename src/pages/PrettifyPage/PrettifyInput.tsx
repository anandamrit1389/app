import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useImportFile, { PickerCallback } from '@/hooks/useImportFile';
import GoogleDrive from '@/assets/google-drive.svg?react';
import Prettify from '@/assets/prettify.svg?react';
import AIStars from '@/assets/ai-stars-1.svg?react';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { Button } from '@/components/ui/button';
import {
  GOOGLE_SLIDE_MIME,
  MICROSOFT_SLIDE_MIME,
  PDF_MIME,
} from '@/helpers/constants/mime-types.const';
import { Trans, useTranslation } from 'react-i18next';
import { PrettifyContext } from '@/contexts/Prettify.context';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import { toast } from 'sonner';
import { convertToPdf } from '@/helpers/utils/convertion';
import useMobile from '@/hooks/useMobile';
import PrettifyProgress from './PrettifyProgress/PrettifyProgress';
import { useEnhancementFinalization } from '@/hooks/useEnhancementFinalization';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import MobileMenu from '../Dashboard/Menu/MobileMenu/MobileMenu';

const PrettifyInput = () => {
  const {
    setPrettifyOutline,
    setFileDataText,
    slidesNumber,
    setSlidesNumber,
    setLanguage,
    setAlias,
    setIsGenerated,
    setTitle,
    setImageStyle,
    setDescription,
    setTheme,
    setTemplate,
    workspace,
    setShowTypePage,
  } = useContext(PrettifyContext);
  const { openPicker, importFile, importLocalFile, authResult } = useImportFile();
  const { enhanceFile, handleRemoveEnhanceFile } = useEnhancementFinalization();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isMobile = useMobile();

  useEffect(() => {
    if (enhanceFile && !loading) {
      handleImportLocalFile(enhanceFile);
    }
  }, [enhanceFile]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) handleImportLocalFile(e.target.files?.[0]);
  };

  const handleImportLocalFile = async (file: File) => {
    setIsGenerated(false);
    setSlidesNumber(0);
    setLoading(true);

    try {
      const convertFile = file.type === MICROSOFT_SLIDE_MIME ? await convertToPdf(file) : file;
      const fileData = convertFile && (await importLocalFile(convertFile));

      if (fileData) {
        setFileDataText(fileData.text);
        const response = fileData.response;

        if (response) {
          setPrettifyOutline(response.outline);
          setLanguage(response.language);
          setAlias(response.alias);
          setTitle(response.title);
          setImageStyle(response.imageStyle || 'web_stock_photos_only');
          setDescription(response.description);
          setTemplate(response.theme);
          response.theme === 'dark' ? setTheme('grey') : setTheme('light');
          setShowTypePage(true);
        }
      }
    } catch {
      toast.error(t('failedImport'));
    }

    if (enhanceFile) {
      handleRemoveEnhanceFile();
    }
    setLoading(false);
  };

  const handleOpenPicker = () => {
    openPicker({
      token: authResult?.access_token,
      viewMimeTypes: `${PDF_MIME},${MICROSOFT_SLIDE_MIME},${GOOGLE_SLIDE_MIME}`,
      //viewId: "PRESENTATIONS",
      callbackFunction: (data: PickerCallback) => {
        if (data.action === 'picked') {
          handleGetDocument(data);
        }
      },
    });
  };

  const handleGetDocument = async (data: PickerCallback) => {
    setIsGenerated(false);
    setSlidesNumber(0);
    setLoading(true);
    const file = data.docs[0];

    try {
      const fileData = await importFile(file.id, file.mimeType, true);

      if (fileData) {
        if (
          file.mimeType === PDF_MIME ||
          file.mimeType === GOOGLE_SLIDE_MIME ||
          file.mimeType === MICROSOFT_SLIDE_MIME
        ) {
          setFileDataText(fileData.text);
          const response = fileData.response;

          if (response) {
            setPrettifyOutline(response.outline);
            setLanguage(response.language);
            setAlias(response.alias);
            setTitle(response.title);
            setImageStyle(response.imageStyle || 'web_stock_photos_only');
            setDescription(response.description);
            setTemplate(response.theme);
            response.theme === 'dark' ? setTheme('grey') : setTheme('light');
            setShowTypePage(true);
          }
        }
      }
    } catch {
      toast.error(t('failedImport'));
    }

    if (enhanceFile) {
      handleRemoveEnhanceFile();
    }
    setLoading(false);
  };

  const backPath =
    !workspace || workspace === 'personal' ? '/dashboard' : `/dashboard/${workspace}`;

  const Content = () => {
    return (
      <>
        <div
          className={`p-10 transition-all ${
            loading ? 'outline-white' : 'outline-[#F1C3C3]'
          } relative flex flex-col items-center justify-center gap-2 rounded-lg bg-secondaryBg outline-dashed outline-2 outline-[#F1C3C3]`}
        >
          <div
            className={`absolute z-0 flex size-full items-center justify-center rounded-lg transition-all ${
              loading ? 'bg-white' : 'bg-transparent'
            }`}
          >
            {loading && <PrettifyProgress slidesNumber={slidesNumber} />}
          </div>
          <Prettify
            className={`z-20 mb-1 size-6 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}
          />
          <Input
            accept=".pdf, .pptx"
            id="picture"
            type="file"
            className={`absolute left-0 top-0 z-20 size-full cursor-pointer opacity-0 ${
              loading && 'hidden'
            }`}
            onChange={handleFileUpload}
            disabled={loading}
          />
          <p
            className={`transition-all ${
              loading ? 'opacity-0' : 'opacity-1'
            } z-10 text-center text-[18px] font-semibold text-black`}
          >
            <Trans i18nKey="presentation.">
              {t('dragAndDrop')} <span className="gradient-text cursor-pointer">{t('browse')}</span>
            </Trans>
          </p>
          <p
            className={`transition-all ${
              loading ? 'opacity-0' : 'opacity-1'
            }  z-10 m-0 text-center text-grey`}
          >
            {t('pptxPdf')}
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            disabled={loading}
            className={`h-16 cursor-pointer items-center justify-between rounded-lg bg-lightGrey p-4 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress ${
              loading ? 'opacity-25' : 'opacity-1'
            }`}
            onClick={handleOpenPicker}
          >
            <div className="flex items-center justify-start gap-4">
              <GoogleDrive className="size-8" />
              <div>
                <p className="font-semibold">{t('googleDriveImport')}</p>
                <p className="text-start text-[14px]">{t('slideDocs')}</p>
              </div>
            </div>
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </>
    );
  };

  if (isMobile) {
    return (
      <>
        <DashboardHeader
          onOpenMenu={() => {
            setMenuOpen(!menuOpen);
          }}
        />
        <MobileMenu menuOpen={menuOpen} onOpenChange={() => setMenuOpen(!menuOpen)} />
        <div
          className="flex size-full flex-col justify-center bg-white p-4"
          style={{ maxWidth: '100%', overflow: 'auto' }}
        >
          <LocaleLink to={backPath} className="fixed left-3 top-16">
            <BaseButton variant="ghost">
              <ArrowBack />
            </BaseButton>
          </LocaleLink>

          <div className="mb-4 flex justify-center">
            <AIStars />
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-[24px] font-bold">{t('enhancePresentation')}</h2>
            <p className="text-tertiaryText">{t('prettifyPresentationDescription')}</p>
          </div>

          <Content />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <LocaleLink to={backPath} className="fixed left-10 top-24">
        <BaseButton variant="ghost">
          <ChevronLeft /> {t('backBtn')}
        </BaseButton>
      </LocaleLink>

      <div className="mx-auto flex h-screen w-full max-w-[50%] flex-col justify-center rounded-lg bg-white p-4">
        <div className="mb-8 flex justify-center">
          <InabitLogo className="size-[96px]" />
        </div>

        <div className="mb-4">
          <div className="text-center text-[24px] font-bold">{t('enhancePresentation')}</div>
          <p className="text-center text-tertiaryText">{t('prettifyPresentationDescription')}</p>
        </div>

        <Content />
      </div>
    </>
  );
};

export default PrettifyInput;
