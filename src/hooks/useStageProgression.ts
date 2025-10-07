import { STAGES } from '@/helpers/constants/prettify.const';
import { ProgressState } from '@/interfaces/prettify.interface';
import { useEffect, useState } from 'react';

const useStageProgression = (slidesNumber: number) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [counter, setCounter] = useState(1);
  const [state, setState] = useState<ProgressState>(ProgressState.PREPARING);

  useEffect(() => {
    if (!slidesNumber) {
      setState(ProgressState.PREPARING);
      return;
    }

    setState(ProgressState.PROCESSING);
  }, [slidesNumber]);

  useEffect(() => {
    if (state !== ProgressState.PROCESSING) return;

    const currentStage = STAGES[stageIndex];

    const timer = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter >= slidesNumber) {
          if (stageIndex < STAGES.length - 1) {
            setStageIndex((prevIndex) => prevIndex + 1);
            return 1;
          } else {
            setState(ProgressState.FINALISING);
            return prevCounter;
          }
        }
        return prevCounter + 1;
      });
    }, currentStage.delay);

    return () => clearInterval(timer);
  }, [stageIndex, state, slidesNumber]);

  return { stageIndex, counter, state };
};

export default useStageProgression;
