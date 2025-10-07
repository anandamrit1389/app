import FileIcon from './FileIcon';
import { X } from 'lucide-react';

function FileTag({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center rounded-full border border-[#F8D7D7] bg-[#FFF0F0] px-2 py-1.5">
        <div className="mr-1.5">
          <FileIcon file={file} />
        </div>
        <span className="mr-1.5 text-sm text-darkText">{file.name}</span>
        <button
          className="flex size-5 items-center justify-center rounded-full hover:bg-red-100 transition-colors"
          onClick={onRemove}
          aria-label="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default FileTag;
