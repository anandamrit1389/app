import { Progress } from '@/components/ui/progress';

const PROGRESS_BAR_WIDTH = 'w-64';
const PROGRESS_BAR_HEIGHT = 'h-[2px]';

const ProgressBar = ({ value }: { value: number }) => (
  <div className={`mx-auto ${PROGRESS_BAR_WIDTH}`}>
    <Progress value={value} className={`${PROGRESS_BAR_HEIGHT} w-full bg-lightGreyPress`} />
  </div>
);

export default ProgressBar;
