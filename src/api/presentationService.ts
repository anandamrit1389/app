import {
  IContent,
  IPresentation,
  ISlide,
  ITemplate,
  IPrettifyOutlineSlide,
  IPrettifyOutlineData,
  Scope,
} from '@/interfaces/ISlides';
import apiService from './apiService';
import { toast } from 'sonner';
import axios from 'axios';
import { getPresentationPasswordFromStorage } from '@/helpers/utils/storage';
import { ImagePurpose } from '@/interfaces/IPresentation';
import { ImageStyleSlug } from '@/interfaces/images-styles.interface';
import { ImageResponse } from '@/interfaces/images-gallery.interface';
import { ChartData } from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';
import { DemoPrettifyOutlineResponse } from '@/interfaces/prettify.interface';
import { WorkspaceParam } from '@/types/workspace.type';

export default class PresentationService {
  static async generatePresentationFromTemplate(
    templateKey: string,
    lang: string,
  ): Promise<IPresentation> {
    return apiService
      .post('/presentations/from-template', { lang, templateKey })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async generatePresentationOutline(
    prompt: string,
    language: string,
    textAmount: string,
    context?: string[],
    instructions?: string[],
    url?: string[],
    documentsData?: string,
    slidesData?: string,
    sheetsData?: string,
    slidesCount?: number,
    keepCopy?: boolean,
  ): Promise<{ result: ISlide[]; description: string }> {
    const correctedInstructions =
      slidesCount &&
      Array.from({ length: slidesCount })
        .map((_, index) =>
          instructions && instructions[index]
            ? `Slide ${index + 1}: ${instructions[index]}`
            : `Slide ${
                index + 1
              }: No specific instructions provided. Create a slide based on your interpretation.`,
        )
        .join('\n');

    return apiService
      .post('/presentations/outline', {
        prompt,
        textAmount,
        context: context?.join(','),
        instructions: correctedInstructions,
        url: url?.join(','),
        documentsData,
        slidesData,
        sheetsData,
        language,
        slidesCount,
        keepCopy,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async generateYoutubePresentationOutline(
    videoIdentifier: string,
    language: string,
    textAmount: string,
    context?: string[],
    url?: string[],
    documentsData?: string,
    slidesData?: string,
    sheetsData?: string,
    slidesCount?: number,
  ): Promise<{ prompt: string; slides: ISlide[] }> {
    return apiService
      .post('/presentations/youtube/outline', {
        videoIdentifier,
        textAmount,
        context: context?.join(','),
        url: url?.join(','),
        documentsData,
        slidesData,
        sheetsData,
        language,
        slidesCount,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
  }

  static async generatePresentationOutlineForTheSpeaker(
    prompt: string,
    language: string,
    textAmount: string,
    context?: string[],
    url?: string[],
    documentsData?: string,
    slidesData?: string,
    sheetsData?: string,
    slidesCount?: number,
  ): Promise<ISlide[]> {
    return apiService
      .post('/presentations/speaker/outline', {
        prompt,
        textAmount,
        context: context?.join(','),
        url: url?.join(','),
        documentsData,
        slidesData,
        sheetsData,
        language,
        slidesCount,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', {
          description: error?.response.data.message,
        });
      });
  }

  static async generatePresentationFromOutline(
    slides: ISlide[],
    workspace: WorkspaceParam,
    description: string,
    language: string,
    textAmount: string,
    template: string,
    theme: string,
    font: string,
    title: string,
    authorName: string,
    pageNumber: boolean,
    watermark: boolean,
    endScreen: boolean,
    imageStyle: string,
    url?: string[],
    context?: string[],
    documentsData?: string,
    slidesData?: string,
    sheetsData?: string,
    speachMode?: boolean,
  ): Promise<IPresentation> {
    return apiService
      .post('/presentations/from-outline', {
        slides,
        workspace,
        description,
        language,
        textAmount,
        template,
        theme,
        font,
        title,
        authorName,
        pageNumber,
        watermark,
        imageStyle,
        endScreen,
        url: url?.join(','),
        context: context?.join(','),
        documentsData,
        slidesData,
        sheetsData,
        speachMode,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async pretiffyPresentation(
    slidesData: string,
    workspace: WorkspaceParam,
    outline: IPrettifyOutlineSlide[],
    language: string,
    template: string,
    theme: string,
    font: string,
    description: string,
    authorName: string,
    pageNumber: boolean,
    watermark: boolean,
    endScreen: boolean,
    imageStyle: string,
    alias: string,
    aiText: boolean,
    aiImages: boolean,
    adjustSlidesNumber: boolean,
    isRedo: boolean,
    signal?: AbortSignal,
  ): Promise<IPresentation> {
    return apiService
      .post(
        '/presentations/prettify',
        {
          slidesData,
          workspace,
          outline,
          language,
          template,
          theme,
          font,
          description,
          authorName,
          pageNumber,
          watermark,
          imageStyle,
          endScreen,
          alias,
          aiText,
          aiImages,
          adjustSlidesNumber,
          isRedo,
        },
        {
          signal: signal,
        },
      )
      .then((response) => response.data)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', { description: error?.message });
        }
      });
  }

  static async pretiffyOutline(slidesData: string): Promise<IPrettifyOutlineData> {
    return apiService
      .post('/presentations/prettify-outline', { slidesData })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async pretiffyDemo(
    slidesData: string,
    theme: string,
    signal?: AbortSignal,
  ): Promise<DemoPrettifyOutlineResponse> {
    return apiService
      .post('/presentations/prettify/demo', { slidesData, theme }, { signal })
      .then((response) => response.data)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', { description: error?.message });
        }
      });
  }

  static convertPresentation(formData: FormData): Promise<string> {
    return apiService.post('/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async generateNewImage(prompt: string, style?: string): Promise<ImageResponse> {
    return apiService
      .post('/openai/image', {
        prompt,
        variant: 'image',
        imageStyle: style,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async upscaleImage(imageUrl: string, accentImage?: string) {
    return apiService
      .post('/openai/upscale', { imageUrl, accentImage })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async generateNewText(
    text: string,
    action: string,
    lang?: string,
    min?: number,
    max?: number,
    sentencesMax?: number,
  ): Promise<string> {
    return apiService
      .post('/openai/text', {
        prompt: text,
        variant: action,
        lang,
        min,
        max,
        sentencesMax,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async generateSpeakerNotes(
    prompt: string,
    slide: ISlide,
    minutes: string,
  ): Promise<string> {
    return apiService
      .post('/openai/notes', {
        prompt: prompt,
        slide: slide,
        estimationTime: minutes,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async generateNewCard(
    slide: ISlide,
    translatedLanguages: string[],
    content?: IContent,
    imageStyle?: ImageStyleSlug,
  ): Promise<IContent> {
    return apiService
      .post('/openai/card', {
        slideContent: content,
        slide,
        imageStyle,
        translatedLanguages,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getPresentation(identifier: string): Promise<IPresentation> {
    const password = getPresentationPasswordFromStorage();
    const sharePassword = password ? `password=${password}` : '';

    return apiService
      .get(`/presentations/${identifier}?${sharePassword}`)
      .then((response) => response.data);
  }

  static async duplicatePresentation(id: string): Promise<IPresentation> {
    return apiService
      .get(`/presentations/${id}/duplicate`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async copyPresentation(id: string, lang?: string): Promise<IPresentation> {
    return apiService
      .post(`/presentations/${id}/copy`, { lang })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async removePresentation(id: string): Promise<IPresentation> {
    return apiService
      .delete(`/presentations/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getPresentations(
    sortOrder: string = 'last updated',
    scope: Scope,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ presentations: IPresentation[]; totalCount: number }> {
    return apiService
      .get(`/presentations?sortOrder=${sortOrder}&page=${page}&limit=${limit}&workspace=${scope}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getTemplates(sortOrder: string = 'last updated'): Promise<IPresentation[]> {
    return apiService
      .get(`/presentations/templates?sortOrder=${sortOrder}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getSlides(
    presentationId: string,
    outlineInstructions?: string[],
    keepCopy?: boolean,
  ): Promise<ISlide> {
    return apiService
      .post(`/presentations/one-by-one/${presentationId}`, {
        instructions: outlineInstructions,
        keepCopy,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async updatePresentation(presentation: IPresentation): Promise<IPresentation> {
    return apiService
      .patch(`/presentations/${presentation.id}`, {
        fontFamily: presentation.fontFamily,
        themeId: presentation.themeId,
        template: presentation.template,
        description: presentation.description,
        slides: presentation.slides,
        title: presentation.title,
        logotype: presentation.logotype,
        logotypeKey: presentation.logotypeKey,
        authorName: presentation.authorName,
        voiceId: presentation.voiceId,
        showPages: presentation.showPages,
        showWatermark: presentation.showWatermark,
        showTitle: presentation.showTitle,
        showAgenda: presentation.showAgenda,
        showEndScreen: presentation.showEndScreen,
        slideTransition: presentation.slideTransition,
        accessType: presentation.accessType,
        accessPassword: presentation.accessPassword,
        isFavourite: presentation.isFavourite,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async updateFavourite(presentation: IPresentation): Promise<IPresentation> {
    return apiService
      .patch(`/presentations/${presentation.id}/updateFavourite`, {
        isFavourite: presentation.isFavourite,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async updateWorkspace(
    presentationId: string,
    workspace: WorkspaceParam,
  ): Promise<IPresentation> {
    return apiService
      .patch(`/presentations/${presentationId}/updateWorkspace`, {
        workspace: workspace,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async updatePrettify(
    alias: string,
    showWatermark: boolean,
    logotype: string | null,
    logotypeKey: string | null,
    title: string,
  ): Promise<IPresentation> {
    return apiService
      .patch(`/presentations/${alias}/updatePrettify`, {
        showWatermark,
        logotype,
        logotypeKey,
        title,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async addNewSlide(
    prompt: string,
    slideType: string,
    variation: string,
    presentationId: string,
    imageStyle: string,
    importedChartData?: ChartData[][],
  ): Promise<IPresentation> {
    return apiService
      .post('/slides', {
        prompt,
        slideType,
        slideVariation: variation,
        presentationId,
        imageStyle,
        importedChartData,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', {
          description: error?.response.data.message,
        });
      });
  }

  static async rerollOneOutline(
    prompt: string,
    description: string,
    context?: string[],
  ): Promise<ISlide> {
    return apiService
      .post('/presentations/reroll', {
        prompt,
        description,
        context: context?.join(';'),
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getImageUploadUrl(
    fileExt: string,
    fileType: string,
    imagePurpose: ImagePurpose,
    signal?: AbortSignal,
  ): Promise<{ imageUrl: string; imageKey: string; putUrl: string }> {
    const mime = fileType.replace('+', '%2B');

    return apiService
      .get('/presentations/upload', {
        params: {
          contentType: mime,
          ext: fileExt,
          imagePurpose: imagePurpose,
        },
        signal,
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', { description: error?.message });
        }
      });
  }

  static async uploadImage(url: string, file: File, signal?: AbortSignal): Promise<boolean> {
    return axios
      .put(`${url}`, file, {
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `inline; filename="${file.name}"`,
        },
        signal,
      })
      .then((response) => response.status === 200)
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Something went wrong :(', { description: error?.message });
        }
        return false;
      });
  }

  static async getUploadS3UrlForPresentation(
    fileName: string,
    ext: string,
    mimeType: string,
  ): Promise<{
    putUrl: string;
  }> {
    return apiService
      .get('/presentations/upload-presentation', {
        params: {
          fileName: fileName,
          ext,
          contentType: mimeType,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async restorePresentation(id: string): Promise<IPresentation> {
    return apiService
      .delete(`/presentations/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async deletePermanently(id: string): Promise<void> {
    return apiService
      .delete(`/presentations/${id}/permanent`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getTemplateById(id: string): Promise<ITemplate> {
    return apiService
      .get(`/presentations/templates/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async getAllTemplates(language: string = 'english'): Promise<ITemplate[]> {
    return apiService
      .get(`/presentations/templates?lang=${language}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static async addTranslation(presentationId: string, lang: string): Promise<IPresentation> {
    return apiService
      .post(`/presentations/${presentationId}/translations`, {
        lang,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }
}
