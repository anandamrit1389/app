import { AxiosResponse } from 'axios';
import apiService from '@/api/apiService';
import {
  CreateFeedbackDto,
  Feedback,
  FeedbackQueryParams,
  FeedbackStats,
  UpdateFeedbackDto,
} from '@/interfaces/feedbacks';

export default class FeedbackService {
  static createFeedback(feedbackData: CreateFeedbackDto): Promise<AxiosResponse<Feedback>> {
    return apiService.post('/feedbacks', feedbackData);
  }

  static getAllFeedbacks(params?: FeedbackQueryParams): Promise<AxiosResponse<Feedback[]>> {
    return apiService.get('/feedbacks', { params });
  }

  static getFeedback(id: string): Promise<AxiosResponse<Feedback>> {
    return apiService.get(`/feedbacks/${id}`);
  }

  static getMyFeedbacks(): Promise<AxiosResponse<Feedback[]>> {
    return apiService.get('/feedbacks/my-feedbacks');
  }

  static getUserFeedbacks(userId: string): Promise<AxiosResponse<Feedback[]>> {
    return apiService.get(`/feedbacks/user/${userId}`);
  }

  static getPresentationFeedbacks(presentationId: string): Promise<AxiosResponse<Feedback[]>> {
    return apiService.get(`/feedbacks/presentation/${presentationId}`);
  }

  static getFeedbackStats(presentationId?: string): Promise<AxiosResponse<FeedbackStats>> {
    const params = presentationId ? { presentationId } : {};
    return apiService.get('/feedbacks/stats', { params });
  }

  static searchFeedbacks(searchTerm: string): Promise<AxiosResponse<Feedback[]>> {
    return apiService.get('/feedbacks/search', {
      params: { term: searchTerm },
    });
  }

  static updateFeedback(
    id: string,
    updateData: UpdateFeedbackDto,
  ): Promise<AxiosResponse<Feedback>> {
    return apiService.patch(`/feedbacks/${id}`, updateData);
  }

  static deleteFeedback(id: string): Promise<AxiosResponse<{ message: string }>> {
    return apiService.delete(`/feedbacks/${id}`);
  }

  static deleteFeedbackByAdmin(id: string): Promise<AxiosResponse<{ message: string }>> {
    return apiService.delete(`/feedbacks/admin/${id}`);
  }
}
