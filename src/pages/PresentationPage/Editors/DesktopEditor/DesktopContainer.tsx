import { useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import SwiperView from '../../SwiperView/Swiper';
import DesktopEditor from './DesktopEditor';

const DesktopContainer = () => {
  const { isFullscreen } = useContext(PresentationContext);

  return isFullscreen ? <SwiperView /> : <DesktopEditor />;
};

export default DesktopContainer;
