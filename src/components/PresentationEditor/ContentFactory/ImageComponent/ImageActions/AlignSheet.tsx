import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ImageCenterPointSelector from './ImageCenterPointSelector';

interface IProps {
  showAlign: boolean;
  onOpenChange: () => void;
  focusPointX: number;
  focusPointY: number;
  onUpdateFocusPoint: (x: number, y: number) => void;
  isCircular: boolean;
  animatePulse: boolean;
  aspectRatio?: number | null;
  imgSrc: string | undefined;
  handleIsCropping: (val: boolean) => void;
  scale: number;
  isCropping: boolean;
}

const AlignSheet = ({
  showAlign,
  onOpenChange,
  focusPointX,
  focusPointY,
  onUpdateFocusPoint,
  animatePulse,
  aspectRatio,
  imgSrc,
  handleIsCropping,
  scale,
  isCropping,
}: IProps) => {
  return (
    <Sheet open={showAlign} onOpenChange={onOpenChange}>
      <SheetContent
        outsideclose="true"
        side="bottom"
        className="flex justify-center rounded-t-2xl bg-white"
      >
        <SheetTitle className="hidden">align options</SheetTitle>
        <div className="max-h-96">
          <ImageCenterPointSelector
            onUpdate={onUpdateFocusPoint}
            focusPointX={focusPointX}
            focusPointY={focusPointY}
            animatePulse={animatePulse}
            imgSrc={imgSrc}
            aspectRatio={aspectRatio}
            handleChangeIsCropping={handleIsCropping}
            scale={scale}
            isCropping={isCropping}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlignSheet;
