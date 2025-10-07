import UploadFileModal from '@/components/Modals/UploadFileModal/UploadFileModal';
import { PresentationContext } from '@/contexts/Presentation.context';
import useMobile from '@/hooks/useMobile';
import { useContext, useState } from 'react';

interface UploadNewImageProps {
  setIsLoading: (isLoading: boolean) => void;
  renderAsDiv?: boolean;
}

const UploadNewImage = ({ setIsLoading, renderAsDiv }: UploadNewImageProps) => {
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(true);

  const { activeImage, handleImageUpload } = useContext(PresentationContext);
  const isMobile = useMobile();

  const handleUpload = async (file: File) => {
    if (!activeImage?.slideId) return;
    setIsLoading(true);
    await handleImageUpload(file, activeImage.slideId, activeImage?.contentId);
    setIsLoading(false);
  };

  const handleToggleUploadModal = () => {
    setIsOpenUploadModal((prev) => !prev);
  };

  return (
    <UploadFileModal
      open={isOpenUploadModal}
      onClose={handleToggleUploadModal}
      onUpload={handleUpload}
      acceptedFormats=".png, .jpeg, .jpg, .gif, .webp, .avif"
      showPreview
      showPicker
      mobile={isMobile}
      renderAsDiv={renderAsDiv}
    />
  );
};

export default UploadNewImage;
