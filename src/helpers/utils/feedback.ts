import { Feedback, FeedbackType } from '@/interfaces/feedbacks';

export function getFeedbackTypeLabel(type: FeedbackType): string {
  return type === FeedbackType.LOVED_IT ? 'Loved it' : 'Not really';
}

export function getFeedbackTypeEmoji(type: FeedbackType): string {
  return type === FeedbackType.LOVED_IT ? '👍' : '👎';
}

export function canEditFeedback(feedback: Feedback, currentUserId: string): boolean {
  return feedback.authorId === currentUserId;
}

export function formatFeedbackDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
