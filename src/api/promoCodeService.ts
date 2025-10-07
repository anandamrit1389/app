import { AxiosResponse } from 'axios';
import { IPromoCode } from '@/interfaces/companies';

import apiService from '@/api/apiService';

export default class PromoCodeService {
  static create(
    code: string,
    expiresAt: number,
    companyId?: string,
  ): Promise<AxiosResponse<IPromoCode>> {
    return apiService.post(
      '/promo-code',
      {
        code,
        expiresAt,
      },
      { params: { companyId } },
    );
  }

  static createBulk(
    companyId: string,
    bulk: {
      create: {
        code: string;
        expiresAt: number;
      }[];
      update: {
        id: string;
        code: string;
        expiresAt: number;
      }[];
      delete: {
        id: string;
      }[];
    },
  ) {
    return apiService.post(`/promo-code/bulk`, bulk, { params: { companyId } });
  }

  static redeemPromoCode(code: string) {
    return apiService.post('/promo-code/redeem', { code });
  }

  static getAllCompanyPromoCodes(companyId: string): Promise<AxiosResponse<IPromoCode[]>> {
    return apiService.get('/promo-code', {
      params: {
        companyId,
      },
    });
  }
}
