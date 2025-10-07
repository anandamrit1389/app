import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CreditCost from '@/components/CreditCost/CreditCost';
import { CreditAction } from '@/interfaces/IPricing';
import CoinFilledWhite from '@/assets/coin-filled-white-small.svg?react';
import { useTranslation } from 'react-i18next';
import AIStar from '@/assets/ai-stars.svg?react';
import LanguageSelector from './LanguageSelector';
import { useState } from 'react';
import { Language } from '@/helpers/constants/languages.const';
import PresentationService from '@/api/presentationService';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '@/helpers/services/AnalyticsService';

export interface AddLanguageModalState {
  isModalShow: boolean;
  presentationId: string | null;
  languagesToSelect: Language[];
  presentationLink: string;
}

interface IProps {
  modalState: AddLanguageModalState;
  onOpenChange: () => void;
  isMobile: boolean;
}

const AddTranslationModal = ({ modalState, onOpenChange, isMobile }: IProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'addLanguageModal',
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeLang = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleChangeOpen = () => {
    if (isLoading) return;
    setSelectedLanguage('');
    onOpenChange();
  };

  const handleAddLanguage = async () => {
    setIsLoading(true);
    if (modalState.presentationId) {
      try {
        await PresentationService.addTranslation(modalState.presentationId, selectedLanguage);
        
        analyticsService.workspaceAddLanguage(selectedLanguage);
      } catch (error) {
        console.error('Failed to add language:', error);
      }
    }
    setIsLoading(false);
    onOpenChange();
    navigate(`/${i18n.language}${modalState.presentationLink}lang=${selectedLanguage}`);
  };

  return (
    <Dialog open={modalState.isModalShow} onOpenChange={handleChangeOpen}>
      <DialogContent className={`gap-0 p-8 sm:max-w-xl`}>
        <DialogTitle className="mb-2 text-left text-xl  font-bold text-darkHeadline">
          {t('title')}
        </DialogTitle>
        <DialogDescription className="mb-6 text-left text-base text-darkText">
          {t('description')}
        </DialogDescription>
        <div className="mb-6">
          <p className="mb-3 text-[12px] uppercase">{t('label')}</p>
          <LanguageSelector
            isMobile={isMobile}
            disabled={isLoading}
            onChange={handleChangeLang}
            selectedLanguage={selectedLanguage}
            languages={modalState.languagesToSelect}
          />
        </div>
        <div className="my-6 w-full text-[12px] text-tertiaryText">
          <p>{t('hint')}</p>
        </div>
        <div className="flex flex-row justify-end">
          <div className="flex flex-row justify-between gap-2">
            <BaseButton
              onClick={() => {
                onOpenChange();
              }}
              disabled={isLoading}
              variant="outline"
              classNames="rounded-lg font-semibold"
            >
              {t('cancel')}
            </BaseButton>
            <BaseButton
              onClick={handleAddLanguage}
              classNames="rounded-lg bg-default-gradient font-semibold text-white py-[10px] px-3"
              loading={isLoading}
              disabled={isLoading || !selectedLanguage}
            >
              <AIStar className="size-5" />
              {t('generate')}
              <span className="text-lightGrey opacity-30">|</span>
              <CreditCost
                action={CreditAction.ADD_PRESENTATION_LANGUAGE}
                icon={<CoinFilledWhite />}
                containerClassName={`!px-0`}
                costClassName={`text-lightGrey mx-0 leading-none`}
              />
            </BaseButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTranslationModal;
