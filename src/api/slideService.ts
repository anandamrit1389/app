import { AxiosResponse } from 'axios';

import apiService from '@/api/apiService';
import {
  IImproveAllSlidesResponse,
  IImproveSlideRequest,
  IPresentation,
  ISlide,
} from '@/interfaces/ISlides';

interface ISlideWithPresentationId extends ISlide {
  presentationId?: string;
}

export default class SlideService {
  static async updateSlide(
    slideId: string,
    slide: Partial<ISlideWithPresentationId>,
    aiSlide?: boolean,
  ): Promise<AxiosResponse<ISlide>> {
    return apiService.patch(`/slides/${slideId}`, {
      ...slide,
      aiSlide,
    });
  }

  static async updateSlidesAudio(
    presentationId: string,
    voiceId: string,
    languageCode: string,
  ): Promise<AxiosResponse<IPresentation>> {
    return apiService.patch(`/slides/audio`, {
      presentationId,
      voiceId,
      languageCode,
    });
  }

  static async updateSlideAudio(
    slideId: string,
    voiceId: string,
    languageCode: string,
    speakerNotes: string,
  ): Promise<AxiosResponse<ISlide>> {
    return apiService.patch(`/slides/${slideId}/audio`, {
      voiceId,
      languageCode,
      speakerNotes,
    });
  }

  static async updateSlideNotes(
    slideId: string,
    speakerNotes: string,
  ): Promise<AxiosResponse<ISlide>> {
    return apiService.patch(`/slides/${slideId}/notes`, { speakerNotes });
  }

  static async improveAllSlides(
    slides: IImproveSlideRequest[],
  ): Promise<AxiosResponse<IImproveAllSlidesResponse>> {
    return apiService.post(`/slides/improveAllSlides`, { slides });
  }

  static async regenerateSlideImage(
    slideId: string,
  ): Promise<AxiosResponse<ISlide & { presentation: IPresentation }>> {
    return apiService.post(`/slides/${slideId}/regenerateSlideImage`);
  }

  static async hideSlideImprovements(
    slideId: string,
    slideNumber: number,
    content: string,
  ): Promise<AxiosResponse<string>> {
    return apiService.post(`/slides/${slideId}/hideSlideImprovements`, {
      slideNumber,
      content,
    });
  }
}
