import Prettify from '@/assets/prettify.svg?react';
import Loader from '@/assets/loader-prettify.svg?react';

const LoadingIcon = () => (
  <div className="relative flex items-center justify-center">
    <Loader className="absolute animate-spin" />
    <Prettify className="relative" />
  </div>
);

export default LoadingIcon;
