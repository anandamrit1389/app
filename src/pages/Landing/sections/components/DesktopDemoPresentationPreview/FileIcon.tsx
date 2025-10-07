import PPTX from '@/assets/pptx-icon.svg?react';
import PDF from '@/assets/pdf-icon.svg?react';

function FileIcon({ file }: { file: File }) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return <PDF width="20" height="20" />;
    case 'pptx':
    case 'ppt':
      return <PPTX width="20" height="20" />;
    default:
      return null;
  }
}

export default FileIcon;
