import { X } from 'lucide-react';
import ExcelIcon from '@/assets/excel.svg?react';
import DriveIcon from '@/assets/drive.svg?react';

const SelectedFile = ({
  selectedFiles,
  handleRemoveFile,
}: {
  selectedFiles: { type: string; name: string }[];
  handleRemoveFile: (index: number) => void;
}) => {
  return (
    selectedFiles.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center border border-[var(--secondary-400)] gap-2 px-3 py-1.5 bg-[var(--secondary-200)] rounded-full"
          >
            <div className="flex items-center gap-2">
              {file.type === 'Excel' ? (
                <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                  <ExcelIcon />
                </div>
              ) : file.type === 'Google Sheet' ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <DriveIcon />
                </div>
              ) : null}
              <span className="text-sm">{file.name}</span>
            </div>
            <button
              onClick={() => handleRemoveFile(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )
  );
};

export default SelectedFile;
