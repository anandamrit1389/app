import { Download } from 'lucide-react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import AIStar from '@/assets/ai-star-black.svg?react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GalleryImage } from '@/interfaces/images-gallery.interface';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@/assets/delete.svg?react';
import { useState, useRef, useEffect } from 'react';
import Loader from '@/assets/loader-color.svg?react';

interface ImageItemProps {
  image: GalleryImage;
  isLoading?: boolean;
  onClick: (image: GalleryImage) => void;
  onDownload: (image: GalleryImage) => void;
  onGenerateNew: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

const ImageItem = ({ image, onClick, onDownload, onGenerateNew, onDelete }: ImageItemProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imageRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <div
      key={image.id}
      className="group relative w-full cursor-pointer overflow-hidden rounded-md"
      onClick={() => onClick(image)}
    >
      <div className="relative w-full">
        <div 
          className="w-full bg-gray-100"
          style={{ 
            paddingBottom: '75%',
            position: 'relative'
          }}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )}
          
          <img 
            ref={imageRef}
            src={image.imageUrl} 
            alt={image.id.toString()} 
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
        {image.canBeDeleted && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <BaseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image);
                  }}
                  variant="outline"
                  classNames="size-10 p-0 bg-white hover:bg-gray-50"
                >
                  <DeleteIcon className="size-5 text-icon-dark" />
                </BaseButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('deleteImage')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateNew(image);
                }}
                variant="outline"
                classNames="size-10 p-0 bg-white hover:bg-gray-50"
              >
                <AIStar className="size-5 text-icon-dark" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('regenerateWithAI')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
                variant="outline"
                classNames="size-10 p-0 bg-white hover:bg-gray-50"
              >
                <Download className="size-5 text-icon-dark" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('downloadImage')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ImageItem;
