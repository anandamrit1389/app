import { AxiosResponse } from 'axios';

import apiService from '@/api/apiService';
import { INotification } from '@/interfaces/INotification';

export default class NotificationService {
  static getAllNotifications(): Promise<AxiosResponse<INotification[]>> {
    return apiService.get(`/notifications`);
  }

  static updateNotificationStatus(notificationId: string): Promise<AxiosResponse<INotification>> {
    return apiService.patch(`/notifications/${notificationId}`);
  }
}
