import { Button } from '@/components/ui/button';
import { useSwiper } from 'swiper/react';

const SwiperButton = () => {
  const swiper = useSwiper();

  return (
    <Button onClick={() => swiper.slideNext()} className="">
      Next
    </Button>
  );
};

export default SwiperButton;
