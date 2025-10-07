import apiService from './apiService';
import { toast } from 'sonner';
import { CreditActionConfig } from '@/interfaces/IPricing';

export default class PricingService {
  static async getPricingConfig(): Promise<Record<string, CreditActionConfig>> {
    return apiService
      .get('/pricing')
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }
}
