import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import MainContainer from '@/components/Containers/MainContainer';
import { PrettifyContext } from '@/contexts/Prettify.context';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import PrettifyOutlineSlide from '@/pages/PrettifyPage/PrettifyOutlineSlide';
import { Trash2, Upload } from 'lucide-react';
import DrawerHeader from '../DrawerHeader/DrawerHeader';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AuthContext } from '@/providers/auth.provider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import PresentationService from '@/api/presentationService';
import presentationService from '@/api/presentationService';
import { ImagePurpose } from '@/interfaces/IPresentation';
import { IPresentation } from '@/interfaces/ISlides';

const PrettifyImprove = () => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [file, setFile] = useState<File | null>(null);
  const [tempKey, setTempKey] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<IPresentation | null>(null);
  const navigate = useLocaleNavigate();

  const {
    alias,
    showWatermark,
    setShowWatermark,
    tempUrl,
    setTempUrl,
    isGenerated,
    title,
    setTitle
  } = useContext(PrettifyContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!isGenerated) return;

    const fetchPresentation = async () => {
      try {
        const data = await presentationService.getPresentation(alias);
        const slides = data.slides.filter(slide => slide.slideType !== 'content-slide' && slide.slideType !== 'closing-slide'); 
        setPresentation({...data, slides});
      } catch (error) {
        console.error('Error fetching presentation:', error);
      } 
    };

    fetchPresentation();
  }, [])

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const splittedName = file.name.split('.');
      const fileExt = splittedName?.[splittedName?.length - 1];
      const mime = file.type;
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp','image/avif'];

      if (allowedTypes.includes(mime)) {
        const data = await presentationService.getImageUploadUrl(
          fileExt,
          mime,
          ImagePurpose.CUSTOM_LOGO,
        );
        const uploadRes = await presentationService.uploadImage(data.putUrl, file);

        if (data && uploadRes) {
          setTempUrl(data.imageUrl);
          setTempKey(data.imageKey);
          toast(t('newLogo'));
        }
      } else {
        toast.error(t('unsupportedType'));
      }
    }
  };

  const removeLogo = () => {
    setFile(null);
    setTempUrl('');
    setTempKey('');
  };

  const handleNext = async () => {
    await PresentationService.updatePrettify(alias, showWatermark, tempUrl, tempKey, title);
    navigate(`/presentation/${alias}`);
  };

  const FileInput = () => {
    if (tempUrl) {
      return (
        <div className="flex flex-col gap-4">
          <img src={tempUrl} className="max-h-40 w-full" />
          <Button className="w-full" variant="outline" onClick={removeLogo}>
            {t('remove')}
            <Trash2 className="ms-3" />
          </Button>
        </div>
      );
    } else if (file && file.name) {
      return (
        <div className="z-1">
          <p className={`transition-all z-10 m-0 text-center text-grey`}>{file.name}</p>
        </div>
      );
    }
  };

  return (
    <MainContainer>
      <div className={cn('w-full h-full capitalize', { 'overflow-y-auto': isMobile })}>
        <DrawerHeader
          title={t('presentationOutline')}
          nextBtnText={t('continue')}
          onNextClick={handleNext}
        />
        <div
          className={cn('flex w-full pt-4 md:pt-6', {
            'flex-col': isMobile,
            'h-[90%]': !isMobile,
          })}
        >
          <div
            className={cn('grid gap-6 size-full auto-rows-max', {
              'grid-cols-1': isMobile,
              'grid-cols-3 pr-10': !isMobile,
            })}
          >
            {presentation && presentation.slides.map((item, index) => (
              <div key={index} className="flex items-start text-sm font-medium rounded-lg">
                <PrettifyOutlineSlide slideType={item.slideType} slideVariation={item.variation} description={item.description || item.title} index={index + 1} />
              </div>
            ))}
          </div>
          <div
            className={cn('flex justify-center md:justify-end h-full w-4/12 ml-auto', {
              'w-full p-0 pb-16': isMobile,
            })}
          >
            <div
              className={cn(
                'bg-lightGrey w-full md:w-[320px] h-fit rounded-xl p-4 flex flex-col gap-6 pb-8 ',
                { 'bg-white mt-10': isMobile },
              )}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark">{t('watermark')}</Label>
                <Switch
                  id="watermark"
                  checked={showWatermark}
                  onCheckedChange={() => {
                    setShowWatermark(!showWatermark);
                  }}
                  disabled={user?.subscription?.ownedSubscription?.status !== 'active'}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium uppercase">{t('logotype')}</p>
                <Label
                  htmlFor="fileInput"
                  className="flex items-center justify-center font-semibold gap-2 bg-white border border-lightGreyPress rounded-lg border-dashed text-darkText px-4 py-2 rounded cursor-pointer"
                >
                  {t('upload')} <Upload />
                </Label>
                <Input
                  id="fileInput"
                  type="file"
                  accept=".png, .jpeg, .jpg, .gif, .webp, .avif"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <FileInput />
              </div>
               <div className="flex flex-col gap-3">
                <p className="text-[12px] font-medium uppercase">{t('title')}</p>
                <Input
                  className="font-medium"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder={t('writeSomething')}
                />
              </div>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-2xl">
            <BaseButton
              onClick={() => navigate(`/presentation/${alias}`)}
              classNames="text-sm py-3 px-4 font-medium"
            >
              {t('goToPresentation')}
            </BaseButton>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default PrettifyImprove;
