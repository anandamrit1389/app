import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';

interface IProps {
  isMobile: boolean;
  sectionRef: RefObject<HTMLDivElement>;
}

const LanguageSection = ({ sectionRef, isMobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  return (
    <div
      id="user-lang"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'px-4 py-6': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-12/12': isMobile,
        })}
      >
        <p className="text-base font-semibold text-darkHeadline">{t('langTitle')}</p>
        <div
          className={cn('w-7/12', {
            'w-full': isMobile,
          })}
        >
          <LanguageSelect
            isMobile={isMobile}
            triggerClassName={cn('w-[250px]', { 'w-full': isMobile })}
            contentClassName={cn('w-[250px]', { 'w-full': isMobile })}
            side="top"
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
