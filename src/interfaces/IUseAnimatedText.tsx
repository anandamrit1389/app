export interface IUseAnimatedText {
  currentElement: ICurrentElement | null;
  switchToNextElement: () => void;
  showFeedbackModal: boolean;
  closeFeedbackModal: () => void;
  presentationId?: string;
}

export interface ICurrentElement {
  slideId: string;
  contentId?: string;
  key?: 'title' | 'subtitle' | 'text';
  index: number;
  slideNumber: number;
}
