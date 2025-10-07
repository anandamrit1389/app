import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext, useEffect, useState } from 'react';
import CheckMark from '@/assets/checkmark-solid.svg?react';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import DrawerHeader from '@/components/DrawersAndSheets/DrawerHeader/DrawerHeader';
import MainContainer from '@/components/Containers/MainContainer';
import { PrettifyContext } from '@/contexts/Prettify.context';
import { useWebSocket } from '@/hooks/useWebSocket';
import AnimatedPreview from './AnimatedPreview';

const PrettifyImprove = () => {
  const isMobile = useMobile();
  // const [randomItems, setRandomItems] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(1);
  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { 
    prettifyOutline, 
    setStep, 
    setTempUrl, 
    setIsGenerated,
    isGenerated,
    setShowMiddleware,
    abortControllerRef,
    setShowTypePage
    } = useContext(PrettifyContext);

  const { socket } = useWebSocket();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTypePage(false);
    }, 300); 

    return () => clearTimeout(timeoutId); 
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('generation-finished', (message) => {
        setIsGenerated(true);
        setTempUrl(message?.logotype);
        setStep('preview');
      });

       socket.on('slide-generated', () => {
        if (firstSlide) {
          setFirstSlide(false); 
        } else {
          setIndex((p) => (p < prettifyOutline?.length ? p + 1 : p));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('generation-finished');
        socket.off('slide-generated');
      }
    };
  }, [socket, firstSlide]);

  // useEffect(() => {
  //   const selected: string[] = [];
  //   while (selected.length < 3) {
  //     const item = items[Math.floor(Math.random() * items.length)];
  //     if (!selected.includes(item)) {
  //       selected.push(item);
  //     }
  //   }
  //   setRandomItems(selected);
  // }, []);

  const handleCancel = () => {
    setShowMiddleware(false);
     if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <MainContainer>
      <div className={cn('w-full h-full', { 'overflow-y-auto': isMobile })}>
        <DrawerHeader
          title={t('improveTitle')}
          nextBtnText={t('makePerfect')}
          onCancelClick={handleCancel}
        />

        <div className="flex flex-col items-center justify-center h-[80%]">
          <AnimatedPreview previews={prettifyOutline} />
          <div>
            {!isGenerated ? (
              <p className="mt-5 text-center font-semibold">
                {t("applyingSettings")} <br />
                {index}/{prettifyOutline?.length}
              </p>
            ) : (
              <p className="mt-5 font-semibold flex items-center justify-center">
                {t("done")}!
                <span className="text-green-500 inline-block ms-2">
                  <CheckMark className="size-6" />
                </span>
              </p>
            )}
          </div>
        </div>

        {isMobile && (
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-2xl">
            <BaseButton onClick={handleCancel} classNames="h-12 w-full font-normal">
              {t('demoPreview.abort')}
            </BaseButton>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default PrettifyImprove;
