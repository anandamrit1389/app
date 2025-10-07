import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import Prettify from '@/assets/prettify.svg?react';
import AiStars3 from '@/assets/ai-stars-3.svg?react';
import { PrettifyContext } from '@/contexts/Prettify.context';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { ChevronLeft } from 'lucide-react';

const PrettifyType = () => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { setStep, handleGenerate, workspace, setShowMiddleware } = useContext(PrettifyContext);

  const goNextRedo = () => {
    setShowMiddleware(true);
    setStep('theme');
    handleGenerate(true);
  }

  const goNextEnhance = () => {
    setShowMiddleware(true);
    setStep('template');
  }

  const backPath =
    !workspace || workspace === 'personal' ? '/dashboard' : `/dashboard/${workspace}`;

  return (
    <>
      <DashboardHeader />
      <LocaleLink to={backPath} className="fixed left-10 top-24">
        <BaseButton className='p-0' variant="ghost">
          <ChevronLeft /> {t('backBtn')}
        </BaseButton>
      </LocaleLink>
      <div className={cn('w-full h-full', { 'overflow-y-auto p-2': isMobile })}>
        <div
          className='flex flex-col w-full h-[90%] justify-center items-center gap-8'
        >
          <div className='flex flex-col gap-2 justify-center text-center'>
            <Prettify className="m-auto" />
            <div>
              <h1 className="text-[24px] font-bold ">{t('typeTitle')}</h1>
              <p className="text-tertiaryText text-sm">{t('typeDescription')}</p>
            </div>
          </div>
          <div 
            className={cn(
              'flex gap-2 mt-[10px] w-1/3',
              { 
                'flex-col w-[90%]' : isMobile,
              } )}>
            <div
              className='flex-1 w-full border border-lightGreyPress rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg border-2'
              onClick={goNextEnhance}
            >
              <p className="flex justify-center items-center gap-1 text-sm py-2 px-3 text-lg font-semibold text-darkText">
                {t('polishExisting')}
                <AiStars3 />
              </p>
            </div>
            <div
              className='flex-1 w-full border border-lightGreyPress rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg border-2'
              onClick={goNextRedo}
            >
              <p className="flex justify-center items-center gap-1 text-sm py-2 px-3 text-lg font-semibold text-darkText">
                {t('startFresh')}
                <AiStars3 />
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrettifyType;