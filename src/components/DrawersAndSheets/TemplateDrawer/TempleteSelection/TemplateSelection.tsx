import MainContainer from '@/components/Containers/MainContainer';
import { getTemplate, getTemplatesPreview } from '@/helpers/constants/presentation-templates.const';
import useMobile from '@/hooks/useMobile';
import TemplateCard from '@/pages/Dashboard/Templates/components/TemplateCard';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import DrawerHeader from '../../DrawerHeader/DrawerHeader';
import useValidContext from '@/hooks/useValidContext';

const TemplateSelection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isMobile = useMobile();

  const { setTemplate, setStep, setTheme, setShowMiddleware, setFont } = useValidContext();

  const handleSelect = (key: string) => {
    const template = getTemplate(key);

    if (template) {
      setTheme(template.themeId);
      setFont(template.fontFamily);
      setTemplate(key);
      setStep('theme');
    }
  };

  const templates = getTemplatesPreview();

  return (
    <MainContainer>
      <div className="w-full">
        <DrawerHeader title={t('selectTemplate')} onClose={() => setShowMiddleware(false)} />

        <div
          className={classNames('grid', {
            'grid grid-cols-2 tablet:grid-cols-3 medium-desktop:grid-cols-4 gap-4 pt-6': !isMobile,
            'grid-cols-2 gap-4 pt-4': isMobile,
          })}
        >
          {templates?.map((pres) => {
            return (
              <div
                onClick={() => {
                  pres.key.includes('fake') ? {} : handleSelect(pres.key);
                }}
                key={pres.key}
                className={pres.key.includes('fake') ? 'cursor-not-allowed' : 'cursor-pointer'}
              >
                <TemplateCard template={pres} mobile={isMobile} hideNumber />
              </div>
            );
          })}
        </div>
      </div>
    </MainContainer>
  );
};

export default TemplateSelection;
