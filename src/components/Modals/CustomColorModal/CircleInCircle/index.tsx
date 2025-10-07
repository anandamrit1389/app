import { forwardRef } from 'react';

interface IProps {
  innerColor: string;
  onClick?: () => void;
}

const CircleInCircle = forwardRef<HTMLDivElement, IProps>(({ innerColor, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-card-stroke"
    >
      <div className="size-4  rounded-full" style={{ backgroundColor: innerColor }} />
    </div>
  );
});

export default CircleInCircle;
