export interface ISubscriptionFAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ISubscriptionFAQSection {
  title: string;
  description: string;
  items: ISubscriptionFAQItem[];
}

export const SubscriptionFAQData: ISubscriptionFAQSection = {
  title: 'subscriptionModal.faqsub.title',
  description: 'subscriptionModal.faqsub.description',
  items: [
    {
      id: 1,
      question: 'subscriptionModal.faqsub.question1',
      answer: 'subscriptionModal.faqsub.answer1',
    },
    {
      id: 2,
      question: 'subscriptionModal.faqsub.question2',
      answer: 'subscriptionModal.faqsub.answer2',
    },
    {
      id: 3,
      question: 'subscriptionModal.faqsub.question3',
      answer: 'subscriptionModal.faqsub.answer3',
    },
  ],
};
