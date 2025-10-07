export interface PurchaseData {
  amount?: number;
  nextBilling?: string;
  credits?: number;
  expiredCredit?: string;
  planName?: string;
  currency?: string;
  nextBillingDate?: string | null;
  status?: string;
  paymentMethod?: string;
  quantity?: number;
  interval?: 'month' | 'year' | 'per_time';
}
