import { IPresentation } from '@/interfaces/ISlides';
import { useState, useRef, useCallback } from 'react';

const useUndo = () => {
  const historyRef = useRef<IPresentation[]>([]);
  const [index, setIndex] = useState(0);

  const setUndoableState = useCallback(
    (newState: IPresentation) => {
      const history = historyRef.current;

      if (index < history.length - 1) {
        historyRef.current = [...history.slice(0, index + 1), newState];
      } else {
        history.push(newState);
      }

      if (history.length > 30) {
        history.shift();
      }

      setIndex(history.length - 1);
    },
    [index],
  );

  const undo = useCallback(() => {
    setIndex((prevIndex) => (prevIndex > 1 ? prevIndex - 1 : prevIndex));
    return historyRef.current[index > 1 ? index - 1 : index];
  }, [index]);

  const redo = useCallback(() => {
    setIndex((prevIndex) =>
      prevIndex < historyRef.current.length - 1 ? prevIndex + 1 : prevIndex,
    );
    return historyRef.current[index < historyRef.current.length - 1 ? index + 1 : index];
  }, [index]);

  return {
    history: historyRef.current,
    setState: setUndoableState,
    undo,
    redo,
    index,
  };
};

export default useUndo;
