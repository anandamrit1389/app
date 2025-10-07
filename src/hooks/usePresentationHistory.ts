import { useCallback, useEffect, useState } from 'react';
import useUndo from './useUndo';
import { IPresentation } from '../interfaces/ISlides';

export const usePresentationHistory = () => {
  const { setState, undo, redo, index, history } = useUndo();
  const [tempState, setTempState] = useState<IPresentation | null>(null);

  const setPresentationHistory = useCallback(
    (presentation: IPresentation, skipHistory?: boolean) => {
      if (!skipHistory) setTempState(presentation);
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (tempState && tempState.generationFinished) setState(tempState);
    }, 500);

    return () => clearTimeout(t);
  }, [tempState]);

  const handleUndo = useCallback(() => {
    const historyItem = undo();

    return historyItem;
  }, [undo]);

  const handleRedo = useCallback(() => {
    const historyItem = redo();

    return historyItem;
  }, [redo]);

  return { setPresentationHistory, handleUndo, handleRedo, index, history };
};
