import { DEFAULT_FILTER } from '@/helpers/constants/image-library.const';
import { downloadImage } from '@/helpers/utils/images';
import { useImageGallery } from '@/hooks/useImageGallery';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import useInfinityScroll from '@/hooks/useInfinityScroll';
import { GalleryImage, ImagesFilterValue } from '@/interfaces/images-gallery.interface';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GenerateNewImageDialog from './GenerateNewImageDialog';
import GeneratedImageDialog from './GeneratedImageDialog';
import Header from './Header';
import ToolBar from './ToolBar';
import MainContent from './MainContent';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import { useCreditsCheck } from '@/hooks/useCreditsCheck';
import { CreditAction } from '@/interfaces/IPricing';

const ImageLibrary = () => {
  const [activeFilter, setActiveFilter] = useState<ImagesFilterValue>(DEFAULT_FILTER);
  const [isGenerateNewImageDialogOpen, setIsGenerateNewImageDialogOpen] = useState(false);
  const [isGeneratedImageDialogOpen, setIsGeneratedImageDialogOpen] = useState(false);
  const [selectedReferenceImage, setSelectedReferenceImage] = useState<GalleryImage>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const { hasEnoughCredits } = useCreditsCheck();
  const contentRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const { images, loading, loadingMore, loadMoreImages, addNewImage, deleteImage } =
    useImageGallery(activeFilter);

  const { isGenerating, generatedImage, handleGenerateImage, setGeneratedImage } =
    useImageGeneration(addNewImage);

  const { handleScroll } = useInfinityScroll({
    loadMore: loadMoreImages,
    isLoading: loadingMore,
  });

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeFilter]);

  const handleFilterChange = (filter: ImagesFilterValue) => {
    setActiveFilter(filter);
  };

  const handleDialogControls = {
    openGenerateDialog: () => {
      setSelectedReferenceImage(undefined);
      setIsGenerateNewImageDialogOpen(true);
    },
    closeGenerateDialog: (open: boolean) => {
      setIsGenerateNewImageDialogOpen(open);
      if (!open) setSelectedReferenceImage(undefined);
    },
    openGeneratedDialog: (open: boolean) => {
      setIsGeneratedImageDialogOpen(open);
      if (!open) setGeneratedImage(undefined);
    },
  };

  const handleActions = {
    generateFromReference: (image: GalleryImage) => {
      setSelectedReferenceImage(image);
      setIsGenerateNewImageDialogOpen(true);
    },
    imageClick: (image: GalleryImage) => {
      setGeneratedImage(image);
      handleDialogControls.openGeneratedDialog(true);
    },
    generateFromGenerated: (image: GalleryImage) => {
      setSelectedReferenceImage(image);
      setIsGeneratedImageDialogOpen(false);
      setIsGenerateNewImageDialogOpen(true);
    },
    download: async (image: GalleryImage) => {
      try {
        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        downloadImage(blob, image.id);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    },
    generateWithDialogs: async (prompt: string, referenceImage?: GalleryImage) => {
      if (hasEnoughCredits(CreditAction.REROLL_IMAGE)) {
        await handleGenerateImage(prompt, referenceImage, () => {
          setIsGenerateNewImageDialogOpen(false);
          setIsGeneratedImageDialogOpen(true);
        });
      }
    },
  };

  return (
    <div className="h-full overflow-hidden px-6 pb-10 pt-0 sm:pt-10">
      <Header onGenerateNew={handleDialogControls.openGenerateDialog} title={t('imageLibrary')} />

      <ToolBar
        activeFilter={activeFilter}
        onFilterClick={handleFilterChange}
        onGenerateNew={handleDialogControls.openGenerateDialog}
      />

      <MainContent
        ref={contentRef}
        loading={loading}
        loadingMore={loadingMore}
        images={images}
        onScroll={handleScroll}
        onGenerateNew={handleActions.generateFromReference}
        onClick={handleActions.imageClick}
        activeFilter={activeFilter}
        onDelete={(image) => {
          setImageToDelete(image);
          setIsDeleteModalOpen(true);
        }}
      />

      <GenerateNewImageDialog
        open={isGenerateNewImageDialogOpen}
        onOpenChange={handleDialogControls.closeGenerateDialog}
        onGenerate={handleActions.generateWithDialogs}
        referenceImage={selectedReferenceImage}
        isGenerating={isGenerating}
        onRemoveReference={() => setSelectedReferenceImage(undefined)}
      />

      {generatedImage && (
        <GeneratedImageDialog
          open={isGeneratedImageDialogOpen}
          onOpenChange={handleDialogControls.openGeneratedDialog}
          generatedImage={generatedImage}
          onGenerateNew={handleActions.generateFromGenerated}
          onDownload={handleActions.download}
          type={generatedImage.type}
        />
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        title={t('deleteImage')}
        description={t('deleteImageDescription')}
        onAction={() => {
          if (imageToDelete) {
            deleteImage(imageToDelete.id);
            setImageToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default ImageLibrary;
