import { useTranslation } from 'react-i18next';
import useStageProgression from '@/hooks/useStageProgression';
import useProgressCalculation from '@/hooks/useProgressCalculation';
import LoadingIcon from './LoadingIcon';
import StatusText from './StatusText';
import ProgressBar from './ProgressBar';

export interface PrettifyProgressProps {
  slidesNumber: number;
  hideCounter?: boolean;
}

const PrettifyProgress = ({ slidesNumber, hideCounter = false }: PrettifyProgressProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { stageIndex, counter, state } = useStageProgression(slidesNumber);
  const progressValue = useProgressCalculation(state, stageIndex, counter, slidesNumber);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 text-center">
      <LoadingIcon />

      <StatusText
        state={state}
        stageIndex={stageIndex}
        counter={counter}
        slidesNumber={slidesNumber}
        hideCounter={hideCounter}
        t={t}
      />

      <ProgressBar value={progressValue} />
    </div>
  );
};

export default PrettifyProgress;
