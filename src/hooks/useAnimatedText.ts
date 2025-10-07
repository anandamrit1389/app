import { IPresentation, ISlide } from '@/interfaces/ISlides';
import { ICurrentElement, IUseAnimatedText } from '@/interfaces/IUseAnimatedText';
import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import FeedbackService from '@/api/feedbackService';

const useAnimatedText = (
  presentation: IPresentation | null,
  changeActiveSlide: (id: string) => void,
  getPresentation: (id: string) => void,
  readonly: boolean = false,
): IUseAnimatedText => {
  const { socket } = useWebSocket();
  const [currentElement, setCurrentElement] = useState<ICurrentElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null);
  const [waitingForTheNext, setWaitingForTheNext] = useState<boolean>(false);
  const [alreadyGenerated, setAlreadyGenerated] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackChecked, setFeedbackChecked] = useState<boolean>(false);

  const checkExistingFeedback = useCallback(async (presentationId: string) => {
    try {
      const response = await FeedbackService.getMyFeedbacks();
      const existingFeedback = response.data.find(
        (feedback) => feedback.presentationId === presentationId,
      );
      return !!existingFeedback;
    } catch (error) {
      console.error('Error checking existing feedback:', error);
      return false;
    }
  }, []);

  const handleGenerationComplete = useCallback(
    async (presentationId: string) => {
      if (readonly || feedbackChecked) return;

      const hasExistingFeedback = await checkExistingFeedback(presentationId);
      setFeedbackChecked(true);

      if (!hasExistingFeedback) {
        setTimeout(() => {
          setShowFeedbackModal(true);
        }, 60000);
      }
    },
    [readonly, feedbackChecked, checkExistingFeedback],
  );

  useEffect(() => {
    if (!presentation || alreadyGenerated) return;

    if (presentation?.generationFinished) {
      setWaitingForTheNext(false);
      setAlreadyGenerated(true);
    } else {
      if (!currentElement && !currentSlide && !alreadyGenerated) {
        const titleSlide = presentation.slides.find((s) => s.slideType === 'title-slide');

        if (!titleSlide) {
          return setWaitingForTheNext(true);
        }

        setCurrentElement({
          slideId: presentation.slides[0].id,
          key: 'title',
          slideNumber: 1,
          index: 0,
        });

        setCurrentSlide(presentation.slides[0]);
      } else if (waitingForTheNext) {
        switchToNextElement();
      }
    }
  }, [currentElement, currentSlide, presentation, waitingForTheNext, alreadyGenerated]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (alreadyGenerated && presentation && currentElement) {
        getPresentation(presentation.id);
        setCurrentSlide(null);
        setCurrentElement(null);
      }
    }, 5000);

    return () => {
      clearTimeout(t);
    };
  }, [socket, presentation, alreadyGenerated, currentElement]);

  useEffect(() => {
    if (socket) {
      socket.on('generation-finished', () => {
        console.info('generation-finished');
        setAlreadyGenerated(true);

        if (presentation) {
          getPresentation(presentation.id);
          handleGenerationComplete(presentation.id);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('generation-finished');
      }
    };
  }, [socket, presentation, handleGenerationComplete]);

  useEffect(() => {
    if (presentation?.id) {
      setFeedbackChecked(false);
      setShowFeedbackModal(false);
    }
  }, [presentation?.id]);

  const switchToNextElement = async () => {
    setWaitingForTheNext(false);

    if (!currentSlide || !presentation) {
      return;
    }

    let index = presentation.slides.findIndex((s) => s.id === currentSlide.id);

    let nextSlide = presentation.slides[index + 1];

    if (presentation.slides[index + 1]?.slideType === 'content-slide' && !presentation.showAgenda) {
      index++;
      nextSlide = presentation.slides[index + 1];
    }

    if (presentation.slides[index + 1]?.slideType === 'content-slide' && !presentation.showAgenda) {
      index++;
      nextSlide = presentation.slides[index + 1];
    }

    if (!nextSlide) {
      return;
    }

    const skipContent = currentSlide.slideType === 'section-headline-slide';

    if (currentSlide?.content?.length > 0 && !skipContent) {
      if (currentElement && !currentElement?.contentId) {
        const val = {
          ...currentElement,
          contentId: currentSlide.content[0]?.id,
          index: 0,
        };

        setCurrentElement(val);

        return;
      } else if (currentElement && currentElement?.contentId) {
        const i = currentSlide.content.findIndex((c) => c.id === currentElement.contentId);

        if (i >= 0 && i + 1 < currentSlide.content.length && currentSlide.content[i + 1]) {
          const val = {
            ...currentElement,
            contentId: currentSlide.content[i + 1]?.id,
            index: i + 1,
          };

          setCurrentElement(val);

          return;
        }
      }
    }

    if (index >= 0 && nextSlide) {
      if (nextSlide.generationFinished) {
        if (nextSlide.slideType === 'closing-slide' && !presentation.showEndScreen) {
          if (alreadyGenerated) {
            setCurrentSlide(null);
            setCurrentElement(null);

            await delay(300);

            getPresentation(presentation.id);
          } else {
            setWaitingForTheNext(true);
          }

          return;
        }

        changeActiveSlide(nextSlide.id);
        setCurrentSlide(nextSlide);
        setCurrentElement({
          slideId: nextSlide.id,
          key: 'title',
          slideNumber: nextSlide.slideNumber,
          index: 0,
        });
      } else {
        console.info('waiting');
        setWaitingForTheNext(true);
      }
    } else {
      await delay(1000);

      setCurrentSlide(null);
      setCurrentElement(null);

      getPresentation(presentation.id);
    }
  };

  const closeFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false);
  }, []);

  return {
    currentElement,
    switchToNextElement,
    showFeedbackModal,
    closeFeedbackModal,
    presentationId: presentation?.id,
  };
};

export default useAnimatedText;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
