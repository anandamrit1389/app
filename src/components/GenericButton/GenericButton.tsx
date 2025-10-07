import Loader from '../../assets/loader.svg?react';

interface IProps {
  onClick: () => void;
  title: string;
  variant?: 'primary' | 'accent' | 'secondary';
  rounded?: boolean;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const GenericButton = ({
  onClick,
  title,
  variant,
  rounded,
  disabled,
  loading,
  className,
}: IProps) => {
  if (variant === 'accent') {
    return (
      <button
        disabled={disabled}
        className={`rounded- h-full bg-accent transition-all hover:bg-accentHover active:bg-accentActive disabled:bg-grey${
          rounded ? 'full' : 'lg'
        } ${!loading ? 'px-[30px]' : 'px-[18px]'} font-semibold text-white`}
        onClick={onClick}
      >
        {!loading ? (
          title
        ) : (
          <div className="animate-spin">
            <Loader />
          </div>
        )}
      </button>
    );
  } else if (variant === 'secondary') {
    return (
      <button
        disabled={disabled}
        className={`h-full rounded-lg border-2 border-mediumGrey bg-transparent px-[30px] font-medium text-darkGrey transition-all disabled:bg-grey`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  } else if (variant === 'primary') {
    return (
      <button
        disabled={disabled}
        className={`h-full rounded-lg bg-gradient-to-r from-slush via-slushPink to-pink px-[30px] font-semibold text-white transition-all hover:bg-gradient-to-br disabled:bg-grey ${className}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={`transition-all ${className}`} onClick={onClick}>
      {title}
    </button>
  );
};

export default GenericButton;
