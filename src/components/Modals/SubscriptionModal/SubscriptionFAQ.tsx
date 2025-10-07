import PlusIcon from '@/assets/landing/plus.svg?react';
import MinusIcon from '@/assets/landing/minus.svg?react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SubscriptionFAQData } from '@/pages/Landing/sections/constants/subscription-faq-data.const';

const SubscriptionFAQ = () => {
  const { t } = useTranslation('translation');
  const { title, description, items } = SubscriptionFAQData;

  return (
    <section className="w-full">
      <div className=" w-full">
        <div className="flex flex-col">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-center text-4xl font-semibold text-darkHeadline">
              {t(title, 'FAQ')}
            </h2>
            <p className="mb-10 text-center text-base text-gray-500">
              {t(
                description,
                'The FAQ highlights benefits, efficiency, and design enhancements of AI-generated presentations.',
              )}
            </p>
          </div>
          <div className="flex-col">
            <Accordion type="multiple" className="w-full">
              {items.map((faq) => (
                <AccordionItem
                  value={faq.question}
                  key={faq.id}
                  className="border-0 border-b p-6 pl-10 last:border-b-0 md:pl-20 [&[data-state=close]>h3>button>svg.minus]:hidden [&[data-state=open]>h3>button>svg.plus]:hidden [&[data-state=open]]:border-none"
                >
                  <AccordionTrigger className="relative py-0 text-left text-base font-semibold leading-[32px] tracking-tight [&>svg:not(.minus):not(.plus)]:hidden">
                    <PlusIcon className="plus absolute -left-8 top-1/2 size-4 -translate-y-1/2 text-darkText" />
                    <MinusIcon className="minus absolute -left-8 top-1/2 size-4 -translate-y-1/2 text-darkText" />
                    {t(faq.question)}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-6 text-base leading-[20px] text-darkText">
                    {t(faq.answer)}
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

export default SubscriptionFAQ;
