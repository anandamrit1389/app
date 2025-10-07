import { CompanyType } from './enums';
export interface ISchool {
  id: string;
  name: string;
  maxMembers: number;
  usedMembers: number;
  createdAt: Date;
  type: CompanyType;
  promoCount: number;
}
