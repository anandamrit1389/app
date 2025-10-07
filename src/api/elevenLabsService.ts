import { AxiosResponse } from 'axios';

import apiService from '@/api/apiService';
import { IVoice } from '@/interfaces/IUsePresentation';

export default class ElevenLabsService {
  static async tts(
    text: string,
    voiceId: string,
    languageCode: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<any>> {
    return apiService.post(`/eleven-labs/text-to-speech`, {
      text,
      voiceId,
      languageCode,
    });
  }

  static async getVoices(): Promise<AxiosResponse<IVoice[]>> {
    return apiService.get(`/eleven-labs/voices`);
  }
}
