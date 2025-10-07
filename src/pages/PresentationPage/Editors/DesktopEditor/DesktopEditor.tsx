import PresentationPreview from '@/components/PresentationPreview/PresentationPreview';
import PresentationHeader from '../../PresentationHeader/PresentationHeader';
import PresentationEditor from '@/components/PresentationEditor/PresentationEditor/PresentationEditor';
import AppSidebar from '@/components/common/AppSidebar/AppSidebar';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext } from 'react';
import useScrollSlides from '@/hooks/useScrollSlides';
import { cn } from '@/lib/utils';
import useKeydownSlides from '@/hooks/useKeydownSlides';
import { Helmet } from 'react-helmet-async';

const DesktopEditor = () => {
  const {
    isSideBarActive,
    containerRef,
    activeSlide,
    presentation,
    changeActiveSlide,
    setActiveImage,
    currentSideBarType,
    showSideBar,
    isDesktopMode,
    filterSlides,
  } = useContext(PresentationContext);

  const handleScroll = useScrollSlides(
    presentation,
    changeActiveSlide,
    setActiveImage,
    currentSideBarType,
    showSideBar,
    isSideBarActive,
    filterSlides,
    activeSlide,
  );

  useKeydownSlides(
    presentation,
    changeActiveSlide,
    setActiveImage,
    currentSideBarType,
    showSideBar,
    isSideBarActive,
    filterSlides,
    activeSlide,
  );

  return (
    <>
      <Helmet>
        <meta
          name="og:title"
          content={`${presentation?.title} ${presentation?.authorName}` || 'Title'}
        />
        <meta name="og:image" content={presentation?.slides[0]?.accentImage || 'Thumbnail'} />
      </Helmet>
      <PresentationHeader />
      <div className="presentation-page-container editor-container w-full bg-[#F8FAFC]">
        <div className="preview-container relative z-10 w-[176px] min-w-[176px] max-w-[176px]">
          <PresentationPreview />
        </div>
        <div
          onWheel={(e) => {
            presentation?.generationFinished && handleScroll(e);
          }}
          ref={containerRef}
          className={cn(`flex flex-col items-center mx-auto px-5 bg-[#F8FAFC]`, {
            'overflow-hidden p-0 absolute inset-0': !isDesktopMode,
            'overflow-y-hidden': isDesktopMode,
          })}
        >
          <PresentationEditor mobile={!isDesktopMode} />
        </div>
        {!isDesktopMode && <div className="w-3/4"></div>}
        <div
          className={`relative z-10 overflow-hidden bg-white ${
            isSideBarActive ? 'w-[350px]' : 'w-0'
          }`}
        >
          <AppSidebar />
        </div>
      </div>
    </>
  );
};

export default DesktopEditor;
