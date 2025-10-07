import { EnhancementContext } from '@/contexts/Enhancement.context';
import { PropsWithChildren, useState } from 'react';

const EnhancementProvider = ({ children }: PropsWithChildren) => {
  const [enhanceFile, setEnhanceFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handeAddEnhanceFile = (file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        sessionStorage.setItem('savedEnhanceFile', reader.result);
        sessionStorage.setItem('enhanceFileName', file.name);
        sessionStorage.setItem('enhanceFileType', file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadEnhanceFile = async () => {
    const fileData = sessionStorage.getItem('savedEnhanceFile');
    const fileName = sessionStorage.getItem('enhanceFileName');
    const fileType = sessionStorage.getItem('enhanceFileType');

    if (fileData && fileName && fileType) {
      const res = await fetch(fileData);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: fileType });

      setEnhanceFile(file);

      return file;
    }

    return null;
  };

  const handleRemoveEnhanceFile = () => {
    setEnhanceFile(null);

    sessionStorage.removeItem('savedEnhanceFile');
    sessionStorage.removeItem('enhanceFileName');
    sessionStorage.removeItem('enhanceFileType');
  };

  return (
    <EnhancementContext.Provider
      value={{ enhanceFile, loadEnhanceFile, handeAddEnhanceFile, handleRemoveEnhanceFile, thumbnail, setThumbnail }}
    >
      {children}
    </EnhancementContext.Provider>
  );
};

export default EnhancementProvider;
