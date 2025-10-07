import apiService from './apiService';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { CreditsPack, IGroupedSubscriptionPlans, ISubscription } from '@/interfaces/ISubscription';
import { PurchaseData } from '@/interfaces/IPayment';

export default class SubscriptionService {
  static async getAllPricingPlans(): Promise<AxiosResponse<IGroupedSubscriptionPlans>> {
    return apiService.get(`/payments/pricing-plans`);
  }

  static async getAllCreditPacks(): Promise<AxiosResponse<CreditsPack[]>> {
    return apiService.get(`/payments/credit-packs`);
  }

  static async getSessionData(sessionId: string): Promise<PurchaseData> {
    return apiService
      .post('/payments/session-data', { sessionId })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
        throw error;
      });
  }

  static async userSubscribe(
    priceId: string,
    quantity: number,
    lang: string,
  ): Promise<{ url: string }> {
    return apiService
      .post('/users/subscribe', { priceId, quantity, lang })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async userEditSubscribtion(lang: string): Promise<{ url: string }> {
    return apiService
      .post('/users/edit-subscription', { lang })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async createSubscription(userId: string): Promise<ISubscription> {
    return apiService
      .post('/subscriptions/create-subscription', { userId })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async deleteSubscription(userId: string): Promise<void> {
    return apiService
      .delete(`/subscriptions/delete-subscription/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }
}
