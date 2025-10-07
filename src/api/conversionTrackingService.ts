import apiService from '@/api/apiService';
import { TrackingPayload } from '@/interfaces/trackingPayload.interface';
import { AxiosResponse } from 'axios';

export default class ConversionTrackingService {
  static saveTrakingId(payload: TrackingPayload): Promise<AxiosResponse<void>> {
    return apiService.post('/tracking', payload);
  }
}
