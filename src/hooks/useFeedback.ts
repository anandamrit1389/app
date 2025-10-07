import { useState, useCallback } from 'react';
import FeedbackService from '@/api/feedbackService';
import {
  CreateFeedbackDto,
  Feedback,
  FeedbackQueryParams,
  FeedbackStats,
  UpdateFeedbackDto,
} from '@/interfaces/feedbacks';
import { toast } from 'sonner';
import { getErrorMessage } from '@/helpers/utils/error';

interface UseFeedbackReturn {
  // State
  loading: boolean;
  feedbacks: Feedback[];
  currentFeedback: Feedback | null;
  stats: FeedbackStats | null;

  // Methods
  createFeedback: (data: CreateFeedbackDto) => Promise<boolean>;
  updateFeedback: (id: string, data: UpdateFeedbackDto) => Promise<boolean>;
  deleteFeedback: (id: string) => Promise<boolean>;
  getFeedback: (id: string) => Promise<void>;
  getAllFeedbacks: (params?: FeedbackQueryParams) => Promise<void>;
  getMyFeedbacks: () => Promise<void>;
  getPresentationFeedbacks: (presentationId: string) => Promise<void>;
  getFeedbackStats: (presentationId?: string) => Promise<void>;
  searchFeedbacks: (searchTerm: string) => Promise<void>;

  // Utility methods
  clearFeedbacks: () => void;
  clearCurrentFeedback: () => void;
}

export const useFeedback = (): UseFeedbackReturn => {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [stats, setStats] = useState<FeedbackStats | null>(null);

  const createFeedback = useCallback(async (data: CreateFeedbackDto): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FeedbackService.createFeedback(data);

      if (response.data) {
        setFeedbacks((prev) => [response.data, ...prev]);
        return true;
      }
      return false;
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error creating feedback';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeedback = useCallback(
    async (id: string, data: UpdateFeedbackDto): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await FeedbackService.updateFeedback(id, data);

        if (response.data) {
          setFeedbacks((prev) =>
            prev.map((feedback) => (feedback.id === id ? response.data : feedback)),
          );
          setCurrentFeedback(response.data);
          toast.success('Feedback successfully updated!');
          return true;
        }
        return false;
      } catch (error: unknown) {
        const message = getErrorMessage(error) || 'Error updating feedback';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteFeedback = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        await FeedbackService.deleteFeedback(id);

        setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));
        if (currentFeedback?.id === id) {
          setCurrentFeedback(null);
        }
        toast.success('Feedback successfully deleted!');
        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error) || 'Error deleting feedback';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentFeedback],
  );

  const getFeedback = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await FeedbackService.getFeedback(id);
      setCurrentFeedback(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error loading feedback';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllFeedbacks = useCallback(async (params?: FeedbackQueryParams): Promise<void> => {
    try {
      setLoading(true);
      const response = await FeedbackService.getAllFeedbacks(params);
      setFeedbacks(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error loading feedbacks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyFeedbacks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await FeedbackService.getMyFeedbacks();
      setFeedbacks(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error loading your feedbacks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPresentationFeedbacks = useCallback(async (presentationId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await FeedbackService.getPresentationFeedbacks(presentationId);
      setFeedbacks(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error loading presentation feedbacks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeedbackStats = useCallback(async (presentationId?: string): Promise<void> => {
    try {
      const response = await FeedbackService.getFeedbackStats(presentationId);
      setStats(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error loading statistics';
      toast.error(message);
    }
  }, []);

  const searchFeedbacks = useCallback(async (searchTerm: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await FeedbackService.searchFeedbacks(searchTerm);
      setFeedbacks(response.data);
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Error searching feedbacks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFeedbacks = useCallback(() => {
    setFeedbacks([]);
  }, []);

  const clearCurrentFeedback = useCallback(() => {
    setCurrentFeedback(null);
  }, []);

  return {
    // State
    loading,
    feedbacks,
    currentFeedback,
    stats,

    // Methods
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedback,
    getAllFeedbacks,
    getMyFeedbacks,
    getPresentationFeedbacks,
    getFeedbackStats,
    searchFeedbacks,

    // Utility methods
    clearFeedbacks,
    clearCurrentFeedback,
  };
};
