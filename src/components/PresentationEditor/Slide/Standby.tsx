import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { PresentationContext } from '@/contexts/Presentation.context';
import { X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AIStar from '@/assets/ai-stars-1.svg?react';

const StandBy = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const { presentation } = useContext(PresentationContext);

  useEffect(() => {
    if (presentation) {
      setShowStandByMessage(!presentation.generationFinished);
    }
  }, [presentation]);

  const [showStandByMessage, setShowStandByMessage] = useState<boolean>(false);

  if (!showStandByMessage) return <></>;

  return (
    <div className="absolute bottom-20 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-3 rounded-lg bg-black p-4 text-[14px] text-lightGrey">
      <AIStar />
      <p className="pe-10">{t('standby')}</p>
      <BaseButton
        variant="ghost"
        classNames="p-0 hover:bg-transparent"
        onClick={() => setShowStandByMessage(!showStandByMessage)}
      >
        <X className="size-5" />
      </BaseButton>
    </div>
  );
};

export default StandBy;
