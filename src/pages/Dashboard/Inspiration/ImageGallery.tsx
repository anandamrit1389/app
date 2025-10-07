import { GALLERY_IMAGES } from '@/helpers/constants/presentation.const';
import inspiration3 from '@/assets/inspiration3.png';

interface ImageGalleryProps {
  isMobile: boolean;
}

const ImageGallery = ({ isMobile }: ImageGalleryProps) => {
  const gapSize = isMobile ? '2' : '4';
  const positionStyles = isMobile
    ? 'max-[500px]:right-[-12rem] max-[400px]:top-[1rem] right-[-10rem] top-[-1rem]'
    : 'xl:top-[-7rem] xl:right-[-8rem] top-[-5rem] right-[-17rem]';

  return (
    <div className={`gap-${gapSize} absolute flex flex-col ${positionStyles} rotate-[-30deg]`}>
      <div className={`flex justify-end ${isMobile ? 'mr-5 max-[400px]:mr-3' : 'lg:mr-30 mr-5'}`}>
        <img
          src={inspiration3}
          alt="Inspiration gallery"
          className={`object-cover object-center ${
            isMobile
              ? 'h-[120px] w-[240px] rounded-[8px] max-[400px]:h-[100px] max-[400px]:w-[200px]'
              : 'h-[215px] w-[375px] rounded-2xl'
          }`}
        />
      </div>
      <div className={`gap-${isMobile ? '2' : '6'} flex flex-row `}>
        {GALLERY_IMAGES.map((image, index) => (
          <img
            key={`inspiration-${index + 4}`}
            src={image.src}
            alt={image.alt}
            className={`object-cover object-center ${
              isMobile
                ? `max-[400px]:${image.mobileStyles} h-[120px] w-[240px] rounded-[8px]`
                : `${image.desktopStyles} rounded-2xl`
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
