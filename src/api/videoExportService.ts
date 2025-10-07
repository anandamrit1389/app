import { AxiosResponse } from 'axios';
import apiService from '@/api/apiService';

export interface VideoExportResponse {
  success: boolean;
  message: string;
  creditsDeducted?: number;
  remainingCredits?: number;
}

export default class VideoExportService {
  static async reportVideoExportSuccess(
    presentationId: string,
  ): Promise<AxiosResponse<VideoExportResponse>> {
    return apiService.post('/video-export/success', { presentationId });
  }
}
