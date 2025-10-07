import { AxiosResponse } from 'axios';

import apiService from '@/api/apiService';

export default class SupportService {
  static reportBug(formData: FormData): Promise<AxiosResponse<string>> {
    return apiService.post(`/support/bug-report`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
