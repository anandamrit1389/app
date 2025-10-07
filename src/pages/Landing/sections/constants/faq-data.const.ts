export interface IFAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface IFAQSection {
  title: string;
  description: string;
  items: IFAQItem[];
}

export const FAQData: IFAQSection = {
  title: 'faqTitle',
  description: 'faqSubtitle',
  items: [
    {
      id: 1,
      question: 'faqQ1',
      answer: 'faqA1',
    },
    {
      id: 2,
      question: 'faqQ2',
      answer: 'faqA2',
    },
    {
      id: 3,
      question: 'faqQ3',
      answer: 'faqA3',
    },
    {
      id: 4,
      question: 'faqQ4',
      answer: 'faqA4',
    },
    {
      id: 5,
      question: 'faqQ5',
      answer: 'faqA5',
    },
    {
      id: 6,
      question: 'faqQ6',
      answer: 'faqA6',
    },
    {
      id: 7,
      question: 'faqQ7',
      answer: 'faqA7',
    },
    {
      id: 8,
      question: 'faqQ8',
      answer: 'faqA8',
    },
    {
      id: 9,
      question: 'faqQ9',
      answer: 'faqA9',
    },
    {
      id: 10,
      question: 'faqQ10',
      answer: 'faqA10',
    },
    {
      id: 11,
      question: 'faqQ11',
      answer: 'faqA11',
    },
    {
      id: 12,
      question: 'faqQ12',
      answer: 'faqA12',
    },
  ],
};
