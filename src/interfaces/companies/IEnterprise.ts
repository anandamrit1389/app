import { CompanyType } from './enums';
export interface IEnterprise {
  id: string;
  name: string;
  maxMembers: number;
  usedMembers: number;
  createdAt: Date;
  type: CompanyType.ENTERPRISE;
  promoCount: number;
  assignedEmail?: string;
}
