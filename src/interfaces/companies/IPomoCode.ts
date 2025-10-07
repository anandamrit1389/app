import { PromoCodeType } from './PromoCode.type';

export interface IPromoCode {
  id: string;
  code: string;
  expiresAt: Date;
  companyId: string;
  redemptionsCount: number;
  promoType: PromoCodeType;
}
