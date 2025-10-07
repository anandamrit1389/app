import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';

interface PromptTip {
  progress: number;
}

const PromptTip = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  return (
    <div>
      <span className="font-bold">{t('tips')}! </span>
      <span>{t('tips1')}</span>
      <LocaleLink className="underline" to="/articles/how-to-write-effective-prompts">
        {t('improvePromptingSkills')}
      </LocaleLink>
    </div>
  );
};

export default PromptTip;
