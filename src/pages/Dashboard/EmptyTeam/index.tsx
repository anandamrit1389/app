import { useState } from 'react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import BussinesLearnMoreModal from '@/components/Modals/BussinesLearnMoreModal';
import ellips1 from '@/assets/ellipse-1.png';
import ellips2 from '@/assets/ellipse-2.png';
import ellips3 from '@/assets/ellipse-3.png';
import UpgradeTeamDialog from './UpgradeTeamDialog';

const images: string[] = [ellips1, ellips3, ellips2];

const EmptyTeam = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'team' });

  const [open, toogleLearnMore] = useState(false);
  const handleOpenChange = () => toogleLearnMore((prev) => !prev);

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-auto bg-current bg-empty-team bg-cover bg-no-repeat p-5">
      <div className="w-[308px]">
        <div className="mb-2 flex items-center justify-center">
          {images.map((image, index) => (
            <div
              key={index}
              className={`size-16 overflow-hidden rounded-full border-2 border-white ${
                index !== 0 ? '-ml-4' : ''
              }`}
            >
              <img src={image} alt={`Person ${index + 1}`} className="size-full object-cover" />
            </div>
          ))}
        </div>
        <h1 className="text-center text-[24px] font-bold text-lightGrey">{t('title')}</h1>
        <h2 className="mb-6 text-center text-[14px] text-lightGrey">{t('body')}</h2>
        <div className="flex justify-between gap-2">
          <BaseButton
            variant="secondary"
            classNames="w-full text-[16px]"
            onClick={handleOpenChange}
          >
            {t('learMoreBtn')}
          </BaseButton>
          <UpgradeTeamDialog />
        </div>
      </div>

      <BussinesLearnMoreModal open={open} onOpenChange={handleOpenChange} />
    </div>
  );
};

export default EmptyTeam;
