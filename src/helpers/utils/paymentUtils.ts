import { PurchaseData } from '@/interfaces/IPayment';

export const formatDate = (dateString: string, lang: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const getPlanDisplayName = (mode: string, purchaseData?: PurchaseData): string => {
  switch (mode) {
    case 'pro':
      return 'Professional';
    case 'enterprise':
      return 'Enterprise';
    case 'credit':
      return 'AI Credit Purchase';
    default:
      return purchaseData?.planName || 'Unknown';
  }
};
