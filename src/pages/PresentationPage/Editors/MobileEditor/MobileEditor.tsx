import PresentationEditor from '@/components/PresentationEditor/PresentationEditor/PresentationEditor';
import PresentationPreview from '@/components/PresentationPreview/PresentationPreview';
import AppSidebar from '@/components/common/AppSidebar/AppSidebar';
import PresentationHeader from '../../PresentationHeader/PresentationHeader';
import 'swiper/css';
import 'swiper/css/pagination';
import { useContext, useEffect, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import SwiperView from '../../SwiperView/Swiper';
import Slide from '@/components/PresentationEditor/Slide/Slide';
import { Helmet } from 'react-helmet-async';

const MobileEditor = () => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const { containerRef, isFullscreen, presentation, exportOpen } = useContext(PresentationContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showMenu) setShowMenu(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [showMenu]);

  return (
    <>
      <Helmet>
        <meta
          name="og:title"
          content={`${presentation?.title} ${presentation?.authorName}` || 'Title'}
        />
        <meta name="og:image" content={presentation?.slides[0]?.accentImage || 'Thumbnail'} />
      </Helmet>
      <div>
        {isFullscreen ? (
          <SwiperView mobile />
        ) : (
          <div ref={containerRef}>
            <div className="h-full bg-white">
              <div className="fixed z-40 w-full">
                <PresentationHeader
                  mobile
                  onOpenPreview={() => setShowPreview(!showPreview)}
                  showPreview={showPreview}
                />
              </div>
              <div className="flex h-full justify-center overflow-auto bg-lightGrey">
                {!exportOpen && <PresentationEditor mobile />}
              </div>
            </div>

            <PresentationPreview
              mobile
              openPreview={showPreview}
              onOpenChange={() => setShowPreview(false)}
            />
            <AppSidebar mobile />

            <div className="fixed -left-[3000px] top-0 z-50" ref={containerRef}>
              {exportOpen &&
                presentation?.slides?.map((slide, index) => (
                  <Slide key={slide.id} slide={slide} index={index} isPreview={false} isForExport />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileEditor;
