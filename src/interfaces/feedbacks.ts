export enum FeedbackType {
  LOVED_IT = 'loved_it',
  NOT_REALLY = 'not_really',
}

export interface Feedback {
  id: string;
  type: FeedbackType;
  description?: string;
  presentationId?: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    profileImg?: string;
  };
  presentation?: {
    id: string;
    title: string;
    alias: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackDto {
  type: FeedbackType;
  description?: string;
  presentationId?: string;
}

export interface UpdateFeedbackDto {
  type?: FeedbackType;
  description?: string;
}

export interface FeedbackQueryParams {
  userId?: string;
  presentationId?: string;
  type?: FeedbackType;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'type';
  sortOrder?: 'ASC' | 'DESC';
}

export interface FeedbackStats {
  total: number;
  lovedIt: number;
  notReally: number;
  lovedItPercentage: number;
  notReallyPercentage: number;
}
