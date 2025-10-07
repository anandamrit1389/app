import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import Divider from '@/components/CustomUI/Divider/Divider';
import FloatingContainer from '@/components/FloatingContainer/FloatingContainer';
import { ImageAligns, ImageFit } from '@/interfaces/ISlides';
import { useTranslation } from 'react-i18next';
import ImageFitMenu from './ImageFitMenu';

interface IProps {
  x: number;
  y: number;
  imageFit: ImageFit;
  setImageFit: (val: ImageFit) => void;
  isOpen: boolean;
  items: IImageAction[];
  onClose: () => void;
  onClickItem: (id: string, val?: ImageAligns) => void;
  mobile?: boolean;
  footer?: React.ReactNode;
}

export interface IImageAction {
  id: string;
  labelKey: string;
  onAction: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ImageActions = ({
  x,
  y,
  imageFit,
  setImageFit,
  isOpen,
  items,
  onClose,
  onClickItem,
  mobile,
  footer,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  if (mobile) {
    return (
      <div className="flex w-full flex-col rounded-t-2xl bg-white p-1">
        {items?.map((i) => {
          return (
            <BaseButton
              key={i.id}
              variant="ghost"
              onClick={() => onClickItem(i.id)}
              classNames="justify-start gap-2"
              disabled={i.disabled}
            >
              <div className="w-6">{i.icon}</div> {t(i.labelKey)}
            </BaseButton>
          );
        })}

        <ImageFitMenu imageFit={imageFit} setImageFit={setImageFit} mobile />

        {footer && (
          <>
            <Divider />
            {footer}
          </>
        )}
      </div>
    );
  }

  return (
    <FloatingContainer x={x} y={y} onClose={onClose} isOpen={isOpen}>
      <div className="z-[1000] flex w-[200px] flex-col rounded-lg bg-white p-1 shadow-lg">
        {items?.map((i) => {
          return (
            <BaseButton
              key={i.id}
              variant="ghost"
              onClick={() => onClickItem(i.id)}
              classNames="justify-start gap-1 font-normal p-2"
              disabled={i.disabled}
            >
              <div className="w-6">{i.icon}</div> {t(i.labelKey)}
            </BaseButton>
          );
        })}

        <ImageFitMenu imageFit={imageFit} setImageFit={setImageFit} />

        {footer && (
          <>
            <Divider />
            {footer}
          </>
        )}
      </div>
    </FloatingContainer>
  );
};

export default ImageActions;
