import { STAGES } from '@/helpers/constants/prettify.const';
import { ProgressState } from '@/interfaces/prettify.interface';

const StatusText = ({
  state,
  stageIndex,
  counter,
  slidesNumber,
  hideCounter,
  t,
}: {
  state: ProgressState;
  stageIndex: number;
  counter: number;
  slidesNumber: number;
  hideCounter: boolean;
  t: (key: string) => string;
}) => {
  const getStatusContent = () => {
    switch (state) {
      case ProgressState.PREPARING:
        return t('preparingImport');

      case ProgressState.PROCESSING:
        return (
          <>
            {t(STAGES[stageIndex].label)}
            {!hideCounter && ` ${counter}/${slidesNumber}`}
          </>
        );

      case ProgressState.FINALISING:
        return t('finalising');

      default:
        return '';
    }
  };

  return (
    <div className="min-h-6">
      <div className="text-tertiaryText">{getStatusContent()}</div>
    </div>
  );
};

export default StatusText;
