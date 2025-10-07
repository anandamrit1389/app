import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import Import from '@/assets/import.svg?react';
import Url from '@/assets/url.svg?react';
import Upload from '@/assets/upload.svg?react';
import GoogleDrive from '@/assets/google-drive.svg?react';
import { useContext, useState } from 'react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import useImportFile, { PickerCallback } from '@/hooks/useImportFile';
import {
  GOOGLE_DOC_MIME,
  GOOGLE_SHEET_MIME,
  GOOGLE_SLIDE_MIME,
  MICROSOFT_DOC_MIME,
  MICROSOFT_SHEET_MIME,
  MICROSOFT_SLIDE_MIME,
  PDF_MIME,
} from '@/helpers/constants/mime-types.const';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ContextModal from '@/components/Modals/ContextModal/ContextModal';
import ImportFromUrlModal from '@/components/Modals/ImportFromUrlModal/ImportFromUrlModal';
import UploadFileModal from '@/components/Modals/UploadFileModal/UploadFileModal';

interface IActions {
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
  function: () => void;
  disabled?: boolean;
}

const ImportSelector = ({ mobile }: { mobile?: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const { openPicker, importFile, importLocalFile, authResult } = useImportFile();
  const {
    setShowUrlModal,
    addImportDocument,
    addImportSlide,
    addImportSheet,
    setDocumentLoading,
    showUploadModal,
    setShowUploadModal,
  } = useContext(PromptPageContext);

  const handleOpenPicker = () => {
    openPicker({
      viewMimeTypes: `${GOOGLE_SHEET_MIME},${PDF_MIME},${GOOGLE_SLIDE_MIME},${MICROSOFT_SLIDE_MIME},${MICROSOFT_DOC_MIME},${GOOGLE_DOC_MIME}`,
      token: authResult?.access_token,
      callbackFunction: (data: PickerCallback) => {
        if (data.action === 'picked') {
          handleGetDocument(data);
        }
      },
    });
  };

  const handleGetDocument = async (data: PickerCallback) => {
    setDocumentLoading(true);
    const file = data.docs[0];
    const fileData = await importFile(file.id, file.mimeType);

    if (fileData) {
      if (
        file.mimeType === GOOGLE_DOC_MIME ||
        file.mimeType === PDF_MIME ||
        file.mimeType === MICROSOFT_DOC_MIME
      ) {
        addImportDocument({ title: file.name, content: fileData });
      } else if (file.mimeType === GOOGLE_SLIDE_MIME || file.mimeType === MICROSOFT_SLIDE_MIME) {
        addImportSlide({ title: file.name, content: fileData });
      } else if (file.mimeType === GOOGLE_SHEET_MIME || file.mimeType === MICROSOFT_SHEET_MIME) {
        addImportSheet({ title: file.name, content: fileData });
      }
    }
    setDocumentLoading(false);
  };

  const handleImportLocalFile = async (file: File) => {
    setDocumentLoading(true);
    const fileData = await importLocalFile(file, true);

    if (fileData) {
      if (file.type === PDF_MIME || file.type === MICROSOFT_DOC_MIME) {
        addImportDocument({
          title: file.name,
          content: fileData,
          isLocal: true,
        });
      } else if (file.type === MICROSOFT_SLIDE_MIME) {
        addImportSlide({ title: file.name, content: fileData, isLocal: true });
      } else if (file.type === MICROSOFT_SHEET_MIME) {
        addImportSheet({ title: file.name, content: fileData, isLocal: true });
      }
    }

    setDocumentLoading(false);
  };

  const actions: IActions[] = [
    {
      titleKey: 'upload',
      icon: <Upload />,
      subtitleKey: 'uploadSubtitle',
      function: () => {
        setShowUploadModal(true);
      },
      disabled: false,
    },
    {
      titleKey: 'urlImport',
      icon: <Url />,
      subtitleKey: 'urlImportSubtitle',
      function: () => {
        setShowUrlModal(true);
      },
    },
    {
      titleKey: 'googleDrive',
      icon: <GoogleDrive />,
      subtitleKey: 'googleDriveSubtitle',
      function: handleOpenPicker,
      disabled: false,
    },
  ];

  if (mobile) {
    return (
      <>
        <BaseButton
          variant="outline"
          classNames="rounded-full p-1 size-[48px]"
          tooltip={t('importOptions')}
          onClick={() => setShowDrawer(!showDrawer)}
        >
          <Import className="size-5 text-darkGrey" />
        </BaseButton>
        <Sheet modal={false} open={showDrawer} onOpenChange={() => setShowDrawer(!showDrawer)}>
          <SheetContent
            hideclose="true"
            side="bottom"
            className="flex w-full flex-col justify-start rounded-t-3xl bg-white"
          >
            <SheetTitle className="hidden">{t('selectOptions')}</SheetTitle>
            {actions?.map((action) => {
              return (
                <BaseButton
                  disabled={action.disabled}
                  key={action.titleKey}
                  variant="ghost"
                  onClick={action.function}
                  icon={action.icon}
                  classNames="w-full justify-start text-[14px] text-[#030712] px-3 py-3"
                >
                  <div className="flex flex-col text-start">
                    <p>{t(action.titleKey)}</p>
                    <p className="text-[14px] font-normal text-tertiaryText">
                      {t(action.subtitleKey)}
                    </p>
                  </div>
                </BaseButton>
              );
            })}
          </SheetContent>
        </Sheet>

        <ContextModal mobile />
        <ImportFromUrlModal mobile />
        <UploadFileModal
          mobile
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImportLocalFile}
          acceptedFormats=".pptx, .pdf, .docx, .xlsx"
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="items-top flex">
          <BaseButton
            variant="outline"
            classNames="rounded-full p-0 h-[48px] aspect-square me-1"
            tooltip={t('importOptions')}
            tooltipClassNames="mb-4"
          >
            <Import className="size-5 text-darkGrey" />
          </BaseButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex min-w-56 flex-col gap-2 p-2">
          {actions?.map((action) => {
            return (
              <BaseButton
                disabled={action.disabled}
                key={action.titleKey}
                variant="ghost"
                onClick={action.function}
                icon={action.icon}
                classNames="w-full justify-start text-[14px] text-[#030712] px-2 py-2 font-semibold"
              >
                <div className="ms-1 flex flex-col text-start">
                  <p>{t(action.titleKey)}</p>
                  <p className="text-[14px] font-normal text-tertiaryText">
                    {t(action.subtitleKey)}
                  </p>
                </div>
              </BaseButton>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportFromUrlModal />
      <UploadFileModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleImportLocalFile}
        acceptedFormats=".pptx, .pdf, .docx, .xlsx"
      />
    </>
  );
};

export default ImportSelector;
