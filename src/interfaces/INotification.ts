export enum INotificationType {
  ARTICLE = 'article',
  INVITATION_ACCEPTED = 'invitation_accepted',
}

export interface INotification {
  id: string;
  recordId: string;
  type: INotificationType;
  userId: string;
  isWatched: boolean;
  createdAt?: string;
  metadata?: {
    inviterEmail?: string;
    inviteeEmail?: string;
    inviteeName?: string;
  };
}
