import AIStar from '@/assets/star-filled.svg?react';

interface IProp {
  label: string;
}

const LandingTag = ({ label }: IProp) => {
  return (
    <div className="flex">
      <div className="flex h-6 flex-row items-center rounded-full bg-default-gradient py-0.5 pl-1 pr-2 uppercase">
        <AIStar width="20" height="20" />{' '}
        <span className="mt-px text-[12px] font-semibold uppercase leading-none text-white">
          {label}
        </span>
      </div>
    </div>
  );
};

export default LandingTag;
