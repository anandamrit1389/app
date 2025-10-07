import { AxiosResponse } from 'axios';

import apiService from '@/api/apiService';
import { User, UserConfig } from '@/interfaces/IUser';
import { InviteCount } from '@/providers/auth.provider';

export default class UserService {
  static getAllUsers(): Promise<AxiosResponse<UserConfig[]>> {
    return apiService.get('/users');
  }

  static updateUser(user: Partial<User>): Promise<AxiosResponse<User>> {
    return apiService.patch(`/users/${user.id}`, user);
  }

  static deleteUser(id: string): Promise<AxiosResponse<string>> {
    return apiService.delete(`/users/${id}`);
  }

  static uploadPicture(formData: FormData): Promise<AxiosResponse<User>> {
    return apiService.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static inviteManyUsers(emails: string[], lang: string): Promise<AxiosResponse<void>> {
    return apiService.post('users/invite-many', { emails, lang });
  }

  static async cancelInvite(inviteId: string): Promise<void> {
    return apiService.delete(`users/invites/${inviteId}`);
  }

  static getUserInviteCount(): Promise<AxiosResponse<InviteCount>> {
    return apiService.get('/users/invite-count');
  }
  static updateUserField(user: Partial<User>): Promise<AxiosResponse<User>> {
    return apiService.patch(`/users/update-fields/${user.id}`, user);
  }
  static getAcceptedInvitationsByUserId(userId: string): Promise<AxiosResponse<any>> {
    return apiService.get(`/users/accepted-invitations/${userId}`);
  }
}
