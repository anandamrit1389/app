import { useContext, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PresentationContext } from '../../../contexts/Presentation.context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BaseButton from '../../CustomUI/BaseButton/BaseButton';

// Sidebar components
import ThemeSideBar from './ThemeSideBar/ThemeSideBar';
import SlideSideBar from './SlideSideBar/SlideSideBar';
import EditImageSideBar from './EditImageSideBar/EditImageSideBar';
import AnalyticsSideBar from './EditImageSideBar/AnalyticsSideBar';

type SideBarType = 'theme' | 'slide' | 'webimages' | 'analytics';

interface SideBarConfig {
  component: React.ReactNode;
  headerKey: string;
  requiresImage?: boolean;
}

interface AppSidebarProps {
  mobile?: boolean;
}

const sideBarConfigs: Record<SideBarType, SideBarConfig> = {
  theme: {
    component: <ThemeSideBar />,
    headerKey: 'editTheme',
  },
  slide: {
    component: <SlideSideBar />,
    headerKey: 'editPage',
  },
  webimages: {
    component: null,
    headerKey: 'gallery',
    requiresImage: true,
  },
  analytics: {
    component: <AnalyticsSideBar />,
    headerKey: 'improveSlideHeader',
  },
};

const AppSidebar = ({ mobile = false }: AppSidebarProps) => {
  const {
    showSideBar,
    currentSideBarType,
    isSideBarActive,
    isDesktopMode,
    activeImage,
    presentation,
  } = useContext(PresentationContext);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { t: tPrompt } = useTranslation('translation', { keyPrefix: 'prompt' });
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const config = sideBarConfigs[currentSideBarType as SideBarType];

  const getCurrentSidebarHeader = () => {
    if (currentSideBarType === 'analytics') {
      return t(config.headerKey, {
        textAmount: tPrompt(`${presentation?.textAmount}`),
      });
    }
    return t(config.headerKey);
  };

  const getCurrentSidebarContent = () => {
    if (currentSideBarType === 'webimages' && activeImage) {
      return <EditImageSideBar sidebarContainerRef={sidebarContainerRef} />;
    }

    if (config.requiresImage && !activeImage) return null;
    return config.component;
  };

  const CloseButton = () => (
    <BaseButton
      variant="ghost"
      classNames="bg-lightGreyHover rounded-full p-1 hover:bg-lightGreyPress active:bg-[#D1D5DB]"
      onClick={() => showSideBar()}
    >
      <X className="size-4" />
    </BaseButton>
  );

  const renderMobileSidebar = () => (
    <Sheet open={isSideBarActive} onOpenChange={() => showSideBar()}>
      <SheetContent
        hideclose="true"
        side="right"
        className="flex w-full flex-col justify-start overflow-auto bg-white"
      >
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="">{getCurrentSidebarHeader()}</SheetTitle>
          <BaseButton
            size="icon"
            variant="ghost"
            classNames="!mt-0 self-start"
            onClick={() => showSideBar()}
            icon={<X className="size-4" />}
          ></BaseButton>
        </SheetHeader>
        {getCurrentSidebarContent()}
      </SheetContent>
    </Sheet>
  );

  const renderDesktopSidebar = () => (
    <div className="absolute size-full">
      <div className="p-4 pb-3 outline outline-1 outline-black/8">
        <div className="flex w-full justify-end">
          <CloseButton />
        </div>
        <h3 className="text-[18px] font-semibold">{getCurrentSidebarHeader()}</h3>
      </div>
      <div ref={sidebarContainerRef} className="size-full overflow-y-auto p-5 pb-[100px]">
        {getCurrentSidebarContent()}
      </div>
    </div>
  );

  return mobile || !isDesktopMode ? renderMobileSidebar() : renderDesktopSidebar();
};

export default AppSidebar;
