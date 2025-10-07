import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ChartData } from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';
import useImportFile, { PickerCallback } from '@/hooks/useImportFile';
import { GOOGLE_SHEET_MIME } from '@/helpers/constants/mime-types.const';
import DriveIcon from '@/assets/drive.svg?react';
import ExcelIcon from '@/assets/excel.svg?react';
import { ChevronRight } from 'lucide-react';
import InfoCircle from '@/assets/info-circle.svg?react';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { processExcelData, processGoogleSheetData } from '@/helpers/utils/process-data';
import SelectedFile from './SelectedFile';
interface ImportDataModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
  onDataImport: (data: ChartData[][], fileInfo?: { type: string; name: string }) => void;
}

const ImportDataModal = ({ isOpen, setIsOpen, onClose, onDataImport }: ImportDataModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ type: string; name: string }[]>([]);
  const [processedData, setProcessedData] = useState<ChartData[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { openPicker, importFile } = useImportFile();
  const { isMobile } = useDeviceDetect();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.csv')
    ) {
      setError(t('invalidFileType'));
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileType = fileExtension === 'xlsx' || fileExtension === 'xls' ? 'Excel' : 'Numbers';

    setSelectedFiles([{ type: fileType, name: file.name }]);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        processExcelData({
          data: e.target.result as ArrayBuffer,
          setIsLoading,
          setError,
          setProcessedData,
          t,
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGoogleDriveSelect = () => {
    openPicker({
      viewId: 'SPREADSHEETS',
      viewMimeTypes: GOOGLE_SHEET_MIME,
      multiselect: false,
      callbackFunction: handlePickerCallback,
    });
  };

  const handlePickerCallback = async (data: PickerCallback) => {
    if (data.action === 'picked' && data.docs.length > 0) {
      const file = data.docs[0];
      try {
        setProcessedData(null);
        setError(null);

        setSelectedFiles([{ type: 'Google Sheet', name: file.name }]);

        const sheetData = await importFile(file.id, file.mimeType);
        await processGoogleSheetData({
          data: sheetData,
          setIsLoading,
          setError,
          setProcessedData,
          t,
        });
        setIsOpen(true);
      } catch (err) {
        console.error('Error importing Google Sheet:', err);
        setError(t('fileProcessingError'));
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setProcessedData(null);
    setError(null);
  };

  const handleContinue = () => {
    onDataImport(processedData || [], selectedFiles[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[90vw]' : 'max-w-lg'} !rounded-2xl gap-2`}>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle className=" text-left text-2xl font-bold">
                {t('createNewChartSlide')}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">{t('chartImportDescription')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Button
                className="relative flex h-auto w-full cursor-pointer items-center justify-between rounded-lg bg-lightGrey p-1 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress"
                onClick={handleGoogleDriveSelect}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10">
                    <DriveIcon />
                  </div>
                  <p className="text-sm text-darkText font-semibold">
                    Google Drive{' '}
                    <span className=" text-tertiaryText font-normal">(Spreadsheet)</span>
                  </p>
                </div>
                <ChevronRight size="24" color="#374151" strokeWidth="1.5" />
              </Button>

              <label
                className="relative flex h-auto w-full cursor-pointer items-center justify-between rounded-lg bg-lightGrey p-1 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress"
                onClick={() => handleFileUpload}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10">
                    <ExcelIcon />
                  </div>
                  <span className="text-sm text-darkText font-semibold">Excel Document</span>
                </div>
                <ChevronRight size="24" color="#374151" strokeWidth="1.5" />
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <SelectedFile selectedFiles={selectedFiles} handleRemoveFile={handleRemoveFile} />

            {error && (
              <div className="flex items-start gap-2 text-red-500 text-sm">
                <InfoCircle className="size-5" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-xs text-tertiaryText mt-4">* {t('documentDeletedNotice')}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="default"
              onClick={() => handleContinue()}
              disabled={isLoading}
              className="bg-black text-white"
            >
              {t('continueToPrompt')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataModal;
