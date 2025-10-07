import apiService from '@/api/apiService';
import {
  CompanyInvitedMember,
  CompanyMember,
  CompanyType,
  IEnterprise,
  ISchool,
  SkippedUser,
} from '@/interfaces/companies';
import { FetchParams, PaginatedResponse } from '@/interfaces/pagination.interface';
import { toast } from 'sonner';

const BASE_PATH = '/admin/companies';

export default class AdminCompanyService {
  static async getAllSchools(): Promise<ISchool[]> {
    return apiService
      .get(`${BASE_PATH}`, {
        params: {
          type: CompanyType.EDUCATIONAL,
        },
      })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async getAllEnterprises(): Promise<IEnterprise[]> {
    return apiService
      .get(`${BASE_PATH}`, {
        params: {
          type: CompanyType.ENTERPRISE,
        },
      })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async getMembers(
    companyId: string,
    params: FetchParams,
  ): Promise<PaginatedResponse<CompanyMember>> {
    return apiService
      .get(`${BASE_PATH}/${companyId}/members`, { params })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async getPendings(
    companyId: string,
    params: FetchParams,
  ): Promise<PaginatedResponse<CompanyInvitedMember>> {
    return apiService
      .get(`${BASE_PATH}/${companyId}/pending-members`, { params })
      .then((res) => res.data)
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }

  static async createSchool(school: { name: string; maxMembers: number }): Promise<ISchool | null> {
    return apiService
      .post(`${BASE_PATH}`, {
        type: CompanyType.EDUCATIONAL,
        ...school,
      })
      .then((res) => res.data)
      .catch((error) => {
        toast.error('Something when wrong :(', { description: error.message });
        return null;
      });
  }

  static async createEnterprise(enterprise: {
    name: string;
    maxMembers: number;
    assignedEmail: string;
  }): Promise<IEnterprise | null> {
    return apiService
      .post(`${BASE_PATH}`, {
        type: CompanyType.ENTERPRISE,
        ...enterprise,
      })
      .then((res) => res.data)
      .catch((error) => {
        toast.error('Something when wrong :(', { description: error.message });
        return null;
      });
  }

  static async updateSchool(
    id: string,
    school: { name: string; maxMembers: number },
  ): Promise<ISchool | null> {
    return apiService
      .patch(`${BASE_PATH}/${id}`, school)
      .then((res) => res.data)
      .catch((error) => {
        toast.error('Something when wrong :(', { description: error.message });
        return null;
      });
  }
  static async updateEnterprise(
    id: string,
    enterprise: { name: string; maxMembers: number; assignedEmail: string },
  ): Promise<IEnterprise | null> {
    return apiService
      .patch(`${BASE_PATH}/${id}`, enterprise)
      .then((res) => res.data)
      .catch((error) => {
        toast.error('Something when wrong :(', { description: error.message });
        return null;
      });
  }

  static async inviteCompanyMembers(
    companyId: string,
    memberEmails: string[],
  ): Promise<SkippedUser[]> {
    return apiService
      .post(`${BASE_PATH}/${companyId}/invite-members`, {
        emails: memberEmails,
      })
      .then((res) => {
        toast.success(res.data.message);
        return res.data.skippedUsers;
      })
      .catch((error) => toast.error('Something when wrong :(', { description: error.message }));
  }
}
