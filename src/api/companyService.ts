import apiService from '@/api/apiService';
import {
  CompanyInfo,
  CompanyDetails,
  SkippedUser,
  CompanyMembership,
} from '@/interfaces/companies';
import { toast } from 'sonner';

const BASE_PATH = '/companies';

const BASE_MY_COMPANY_PATH = `${BASE_PATH}/my-company`;

export default class CompanyService {
  static async getCompanyMembershipInfo(): Promise<CompanyMembership> {
    return apiService
      .get(`${BASE_PATH}/membership`)
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async getComanyInfo(): Promise<CompanyInfo> {
    return apiService
      .get(`${BASE_MY_COMPANY_PATH}/info`)
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async getComanyDetails(): Promise<CompanyDetails> {
    return apiService
      .get(`${BASE_MY_COMPANY_PATH}/details`)
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async updateCompanyInfo(company: Partial<CompanyInfo>): Promise<CompanyInfo> {
    return apiService
      .patch(`${BASE_MY_COMPANY_PATH}/info`, company)
      .then((res) => {
        toast.success('Company info updated');
        return res.data;
      })
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async inviteCompanyMembers(memberEmails: string[]): Promise<SkippedUser[]> {
    return apiService
      .post(`${BASE_MY_COMPANY_PATH}/invite-members`, {
        emails: memberEmails,
      })
      .then((res) => {
        toast.success(res.data.message);
        return res.data.skippedUsers;
      })
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async deleteMember(memberId: string): Promise<void> {
    return apiService
      .delete(`${BASE_MY_COMPANY_PATH}/members/${memberId}`)
      .then((res) => {
        toast.success(res.data.message);
        return res.data;
      })
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async cancelInvite(inviteId: string): Promise<void> {
    return apiService
      .delete(`${BASE_MY_COMPANY_PATH}/invites/${inviteId}`)
      .then((res) => {
        toast.success(res.data.message);
        return res.data;
      })
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async uploadLogotype(formData: FormData): Promise<CompanyInfo> {
    return apiService
      .post(`${BASE_MY_COMPANY_PATH}/logotype/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async uploadFont(formData: FormData): Promise<CompanyInfo> {
    return apiService
      .post(`${BASE_MY_COMPANY_PATH}/font/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }
}
