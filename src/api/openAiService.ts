import { AxiosResponse } from 'axios';
import apiService from '@/api/apiService';
import { ImageResponse, TransformImageDto } from '@/interfaces/images-gallery.interface';

export default class OpenAIService {
  static imageTransform(
    transformImageDto: TransformImageDto,
  ): Promise<AxiosResponse<ImageResponse>> {
    return apiService.post('/openai/image-transform', transformImageDto);
  }

  static improvePrompt(prompt: string): Promise<AxiosResponse<string>> {
    return apiService.post('/openai/improve-prompt', { prompt });
  }

  static shufflePrompt(): Promise<AxiosResponse<string>> {
    return apiService.post('/openai/shuffle-prompt');
  }

  static readPresentation(formData: FormData): Promise<AxiosResponse<string>> {
    return apiService.post('/openai/read-presentation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
