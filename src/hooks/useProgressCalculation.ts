import { STAGES } from '@/helpers/constants/prettify.const';
import { ProgressState } from '@/interfaces/prettify.interface';

const useProgressCalculation = (
  state: ProgressState,
  stageIndex: number,
  counter: number,
  slidesNumber: number,
) => {
  const totalSteps = slidesNumber * STAGES.length + 1;

  if (state === ProgressState.PREPARING || !slidesNumber) return 0;
  if (state === ProgressState.FINALISING) {
    return ((slidesNumber * STAGES.length) / totalSteps) * 100;
  }

  const previousStagesSteps = stageIndex * slidesNumber;
  const currentStageSteps = counter;

  return ((previousStagesSteps + currentStageSteps) / totalSteps) * 100;
};

export default useProgressCalculation;
