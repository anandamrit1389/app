import { useContext, useMemo } from 'react';
import { PresentationContext } from '../../../contexts/Presentation.context';
import Slide from '../Slide/Slide';
import MobileSlide from '../Slide/Mobile/MobileSlide';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import { useTranslation } from 'react-i18next';
import useScreenSize from '@/hooks/useScreenSize';
import ImageTransformModal from '@/components/Modals/ImageTransformModal/ImageTransformModal';

const PresentationEditor = ({ mobile }: { mobile?: boolean }) => {
  const {
    presentation,
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    confirmDelete,
    changeActiveSlide,
    readonly,
    filterSlides,
    countAgendaSlides,
    isSideBarActive,
    setTransformOpen, 
    transformOpen, 
    handleTransformImage, 
    referenceImage 
  } = useContext(PresentationContext);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  useScreenSize(isSideBarActive, mobile);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeActive = (swiper: any) => {
    const slide = presentation?.slides[swiper.activeIndex + countAgendaSlides];
    if (slide) {
      changeActiveSlide(slide.id);
    }
  };

  const slides = useMemo(() => {
    return filterSlides(presentation?.slides);
  }, [presentation?.slides, filterSlides]);

  if (mobile) {
    return (
      <div className="w-slideMax">
        <Swiper
          navigation
          direction={'horizontal'}
          slidesPerView={1}
          pagination={{
            type: 'bullets',
            clickable: true,
            dynamicBullets: true,
            bulletActiveClass: 'active-bullet',
          }}
          onSlideChange={handleChangeActive}
          modules={[Pagination]}
          className="!w-auto"
          speed={0}
        >
          {slides?.map((slide, index) => (
            <SwiperSlide key={slide.id} className="overflow-hidden">
              <MobileSlide slide={slide} index={index} readonly={readonly} />
            </SwiperSlide>
          ))}
        </Swiper>

        <DeleteConfirmationModal
          title={t('deleteSlide')}
          description={t('deleteSlideDescription')}
          open={showDeleteConfirmation}
          onOpenChange={() => setShowDeleteConfirmation(false)}
          onAction={confirmDelete}
        />
        <ImageTransformModal 
          open={transformOpen}
          onOpenChange={() => setTransformOpen(false)}
          onGenerate={handleTransformImage}
          referenceImage={referenceImage}
        />
      </div>
    );
  }

  return (
    <>
      {slides?.map((slide, index) => (
        <div key={slide.id}>
          <Slide slide={slide} index={index} isPreview={readonly} />
        </div>
      ))}

      <DeleteConfirmationModal
        title={t('deleteSlide')}
        description={t('deleteSlideDescription')}
        open={showDeleteConfirmation}
        onOpenChange={() => setShowDeleteConfirmation(false)}
        onAction={confirmDelete}
      />
      <ImageTransformModal 
        open={transformOpen}
        onOpenChange={() => setTransformOpen(false)}
        onGenerate={handleTransformImage}
        referenceImage={referenceImage}
      />
    </>
  );
};

export default PresentationEditor;
