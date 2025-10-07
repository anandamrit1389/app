import { useContext, useEffect, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context.ts';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton.tsx';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import WebImages from '@/components/common/AppSidebar/EditImageSideBar/WebImages';
import Search from '@/assets/search.svg?react';
import ColorPicker from '@/assets/color-picker.svg?react';
import WorldIcon from '@/assets/url.svg?react';
import Unsplash from '@/assets/gallery.svg?react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import UploadNewImage from './UploadNewImage';
import Pexels from '@/assets/pexels.svg?react';
import PexelsImages from './PexelsImages';
import ImageGallery from './ImageGallery';
import { Button } from '@/components/ui/button';
import InfoCircle from '@/assets/info-circle.svg?react';
import { setUserInfoToStorage, getDisclaimerDismissedFromStorage, setDisclaimerDismissedToStorage } from '@/helpers/utils/storage';
import { getUserInfoFromStorage } from '@/helpers/utils/storage';
import userService from '@/api/userService';
import { AuthContext } from '@/providers/auth.provider';
// import UnsplashImages from "@/components/common/AppSidebar/EditImageSideBar/UnsplashImages";

interface StockOption {
  name: WebImagesResources;
  icon: React.ReactNode;
  translationKey: string;
}

enum WebImagesResources {
  GALLERY = 'Image Gallery',
  PEXELS = 'Pexels',
  GOOGLE = 'Web Search',
  UPLOAD = 'Upload',
}

const STOCK_LIST: StockOption[] = [
  {
    name: WebImagesResources.GALLERY,
    icon: <Unsplash />,
    translationKey: 'imageGallery',
  },
  {
    name: WebImagesResources.GOOGLE,
    icon: <WorldIcon className="[&_path]:stroke-darkText" />,
    translationKey: 'websearch',
  },
  {
    name: WebImagesResources.PEXELS,
    icon: <Pexels />,
    translationKey: 'pexels',
  },
  {
    name: WebImagesResources.UPLOAD,
    icon: <Upload />,
    translationKey: 'upload',
  },
];

interface StockImagesProps {
  sidebarContainerRef: React.RefObject<HTMLDivElement>;
}

const StockImages = ({ sidebarContainerRef }: StockImagesProps) => {
  const { presentation, selectedLanguage, activeImage } = useContext(PresentationContext);
  const { user, handleUserInfo } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [loading, setLoading] = useState(false);
  const [stockResource, setStockResource] = useState<WebImagesResources | ''>(
    WebImagesResources.GALLERY,
  );
  const [useTheme, setUseTheme] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState(
    activeImage?.keywords || presentation?.keyWords || presentation?.titleTranslations?.[selectedLanguage] || presentation?.title || ''
  );
  const [reqStr, setReqStr] = useState<string>(presentation?.keyWords ?? '');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const disclaimerDismissed = getDisclaimerDismissedFromStorage();
    setShowDisclaimer(user?.showDisclaimer !== false && !disclaimerDismissed);
  }, [user]);

  useEffect(() => {
    if (activeImage?.keywords) {
      setSearchPrompt(activeImage.keywords);
      setReqStr(activeImage.keywords);
    } else {
      setSearchPrompt(presentation?.keyWords || presentation?.titleTranslations?.[selectedLanguage] || presentation?.title || '');
    }
  }, [activeImage, presentation, selectedLanguage]);

  const handleDisclaimer = async () => {
    setShowDisclaimer(false);
    setDisclaimerDismissedToStorage(true);
    
    const userFromStorage = getUserInfoFromStorage();
    if (userFromStorage) {
      userFromStorage.showDisclaimer = false;
      setUserInfoToStorage(userFromStorage);
      handleUserInfo({ user: userFromStorage });
      
      try {
        const updatedUser = (await userService.updateUserField({
          id: userFromStorage.id,
          showDisclaimer: false,
        })).data;
        
        if (updatedUser) {
          setUserInfoToStorage(updatedUser);
          handleUserInfo({ user: updatedUser });
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchPrompt !== reqStr) {
        setReqStr(searchPrompt);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [reqStr, searchPrompt]);

  const renderSearchBar = () => {
    if (
      stockResource !== WebImagesResources.GOOGLE &&
      stockResource !== WebImagesResources.PEXELS
    ) {
      return null;
    }

    return (
      <div className="relative flex gap-2 pe-[1px]">
        <Search className="absolute left-2 top-[10px]" />
        <Input
          className="ps-9"
          value={searchPrompt}
          onChange={(e) => {
            setSearchPrompt(e.target.value);
          }}
        />
        <BaseButton
          variant="outline"
          classNames={cn('rounded-full p-0 h-10 w-10 aspect-square bg-white', {
            'border-[#374151] ring-[1px] ring-[#DDDDDD]': useTheme,
            'border-lightGreyPress': !useTheme,
          })}
          onClick={() => setUseTheme((v) => !v)}
        >
          <ColorPicker />
        </BaseButton>
      </div>
    );
  };

  const renderContent = () => {
    switch (stockResource) {
      case WebImagesResources.PEXELS:
        return reqStr ? (
          <PexelsImages
            reqStr={reqStr}
            useTheme={useTheme}
            sidebarContainerRef={sidebarContainerRef}
          />
        ) : null;
      case WebImagesResources.GOOGLE:
        return reqStr ? <WebImages reqStr={reqStr} useTheme={useTheme} /> : null;
      case WebImagesResources.GALLERY:
        return <ImageGallery sidebarContainerRef={sidebarContainerRef} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="my-2">
        <span className="text-[12px] font-medium uppercase">{t('photos')}</span>
      </div>
      <div className="h-full overflow-hidden">
        <div className="mb-4 flex gap-2 p-[2px]">
          {STOCK_LIST.map((stock) => (
            <BaseButton
              loading={stockResource === stock.name && loading}
              classNames={cn('w-full p-4 h-12', {
                'border-darkText ring-[1.5px] ring-[#DDDDDD] hover:border-darkText':
                  stockResource === stock.name,
              })}
              variant="outline"
              key={stock.name}
              onClick={() => {
                setStockResource(stock.name);
              }}
              icon={stock.icon}
              tooltip={t(stock.translationKey)}
            />
          ))}
        </div>
        {stockResource === WebImagesResources.UPLOAD && (
          <div className="p-2">
            <UploadNewImage setIsLoading={setLoading} renderAsDiv={true} />
          </div>
        )}
        {stockResource === WebImagesResources.GOOGLE && showDisclaimer ? (
          <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-lg bg-muted/50 p-4">
            <InfoCircle className="size-6" />
            <p className="text-sm text-muted-foreground">{t('disclaimerMessage')}</p>
            <Button
              variant="default"
              size="sm"
              className="mt-2 w-fit bg-darkText text-white"
              onClick={handleDisclaimer}
            >
              {t('ok')}
            </Button>
          </div>
        ) : (
          <>
            {renderSearchBar()}
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default StockImages;
