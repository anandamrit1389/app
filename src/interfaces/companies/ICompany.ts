import { IBaseMember } from '../common';
import { IFont, IFontSet } from '../font.interface';
import { CompanyMemberRole } from './enums';

export interface CompanyInfo {
  id: string;
  name: string | '';
  imgUrl: string | null;
  themeId: string | null;
  themeColors: ThemeColors | null;
  fontId: string | null;
  companyFonts: IFontSet | null;
  uploadedFonts: IFont[];
}

export interface CompanyMembership {
  companyId: string;
  companyName: string;
  companyLogo: string | null;
  fontId?: string;
  themeId?: string;
  companyFonts: IFontSet | null;
  themeColors: ThemeColors | null;
  members: CompanyMember[];
}

export interface CompanyDetails {
  id: string;
  totalSeats: number;
  remainingSeats: number;
  members: CompanyMember[];
  pendingInvites: CompanyInvitedMember[];
  createdBySource: 'admin' | 'system';
}

export interface CompanyMember extends IBaseMember {
  role: CompanyMemberRole;
}

export interface CompanyInvitedMember extends IBaseMember {
  isAccepted: boolean;
}

export interface CompanyInviteResponse {
  skippedUsers: SkippedUser[];
  message: string;
}

export interface SkippedUser {
  email: string;
  message: string;
}

export interface ICompanyContext {
  companyInfo: CompanyInfo | null;
  companyDetails: CompanyDetails | null;
  loading: boolean;
  loadCompany: () => Promise<void>;
  loadCompanyDetails: () => Promise<void>;
  handleLocalUpdateCompanyInfo: (companyInfo: CompanyInfo) => void;
  handleUpdateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  uploadCompanyFont: (formData: FormData) => void;
}

export interface ThemeColors {
  backgroundColor: string;
  headlineColor: string;
  textColor: string;
  accentColor: string;
}
