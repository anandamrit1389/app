import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ImageGallery from './ImageGallery';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

export interface InspirationCardProps {
  isMobile: boolean;
  onSeeIntroduction: () => void;
}

const InspirationCard = ({ isMobile, onSeeIntroduction }: InspirationCardProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'inspiration' });
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSeeIntroduction();
  };

  return (
    <div 
      className="relative mb-8 w-full overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-lg cursor-pointer"
      onClick={onSeeIntroduction}
    >
      <div
        className={`flex flex-row items-center ${
          !isMobile && 'justify-between'
        } h-[${isMobile ? '200' : '240'}px] bg-default-gradient p-6`}
      >
        <div
          className={`z-10 flex h-full flex-col justify-end gap-2 text-white ${
            isMobile ? 'w-[80%]' : 'w-full'
          }`}
        >
          <div className="flex flex-col justify-end gap-1">
            <h2 className={`${isMobile ? 'text-xl' : 'text-[28px] max-w-[60%]'} font-bold`}>
              {t('allYouNeed')}
            </h2>
            <p
              className={`text-xs ${isMobile ? 'max-w-[250px]' : 'max-w-[250px] lg:max-w-[350px]'}`}
            >
              <Trans
                i18nKey="inspiration.newToInabit"
                components={{
                  1: (
                    <a
                      href="https://www.inabit.ai/"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="font-semibold transition"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ),
                }}
              />
            </p>
          </div>
          <BaseButton 
            classNames="w-max" 
            isDark 
            variant="secondary" 
            onClick={handleButtonClick}
          >
            {t('seeIntroduction')}
          </BaseButton>
        </div>
        <ImageGallery isMobile={isMobile} />
      </div>
    </div>
  );
};
export default InspirationCard;
