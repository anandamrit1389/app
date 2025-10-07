import apiService from './apiService';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { ITransaction } from '@/interfaces/IUser';
import { FetchParams, PaginatedResponse } from '@/interfaces/pagination.interface';

export default class TransactionService {
  static async getAllTransactions(lang: string): Promise<AxiosResponse<ITransaction[]>> {
    return apiService
      .get(`/transactions?lang=${lang}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getPaginatedTransactions(
    params: FetchParams,
  ): Promise<PaginatedResponse<ITransaction>> {
    return apiService
      .get(`/transactions`, { params })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }
}
