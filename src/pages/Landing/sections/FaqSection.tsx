import PlusIcon from '@/assets/landing/plus.svg?react';
import MinusIcon from '@/assets/landing/minus.svg?react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQData } from './constants/faq-data.const';

const FAQSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });
  const { title, description, items } = FAQData;

  const renderAnswer = (answer: string) => {
    if (answer === 'faqA11') {
      return (
        <>
          {t(answer)
            .split('Pricing Page')
            .map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <LocaleLink to="/pricing" className="underline">
                    {t('pricingPage')}
                  </LocaleLink>
                )}
              </span>
            ))}
        </>
      );
    }
    return t(answer);
  };

  return (
    <section className="w-full bg-secondaryBg py-20 md:py-[120px]">
      <div className="mx-auto max-w-[1168px] px-4">
        <div className="flex flex-col">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-2 text-center font-semibold text-darkHeadline text-secondaryTitle">
              {t(title)}
            </h1>

            <h1 className="mb-10 text-center text-darkText text-bodyLarge">{t(description)}</h1>
          </div>
          <div className="flex-col desktop:mx-24 big-desktop:mx-32">
            <Accordion type="multiple" className="w-full">
              {items.map((item) => (
                <AccordionItem
                  value={item.question}
                  key={item.id}
                  className="p-6 pl-[72px] [&[data-state=close]>h3>button>svg.minus]:hidden [&[data-state=open]>h3>button>svg.plus]:hidden [&[data-state=open]]:border-none"
                >
                  <AccordionTrigger className="relative py-0 text-left text-[24px] font-semibold leading-[32px] tracking-tight [&>svg:not(.minus):not(.plus)]:hidden">
                    <PlusIcon className="plus absolute -left-12 top-1/2 size-4 -translate-y-1/2 text-darkText" />
                    <MinusIcon className="minus absolute -left-12 top-1/2 size-4 -translate-y-1/2 text-darkText" />
                    {t(item.question)}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-6 text-[18px] leading-[28px] text-darkText">
                    {renderAnswer(item.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
