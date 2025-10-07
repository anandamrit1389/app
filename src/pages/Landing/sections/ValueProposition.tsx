import { useTranslation } from 'react-i18next';

const ValueProposition = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  return (
    <section className="mb-20">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="flex min-h-[404px] justify-center rounded-2xl bg-secondaryBg py-[82px]">
          <div className="flex max-w-[871px] flex-col items-center rounded-2xl bg-secondaryBg p-4 text-center">
            <h2 className="gradient-text mb-2 text-[38px] font-semibold leading-[54px] md:text-[53px] md:leading-[64px]">
              {t('valuePropositionHeader')}
            </h2>
            <p className="text-[21px] leading-[32px] text-darkHeadline">
              {t('valuePropositionDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
