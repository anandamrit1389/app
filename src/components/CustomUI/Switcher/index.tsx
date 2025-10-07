import React from 'react';

interface SwitcherProps<T> {
  options: T[];
  activeOption: T;
  onSwitch: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  getKey: (option: T) => string;
  className?: string;
}

export const Switcher = <T,>({
  options,
  activeOption,
  onSwitch,
  renderOption,
  getKey,
  className,
}: SwitcherProps<T>) => {
  return (
    <div
      className={`relative mx-auto inline-flex items-center gap-0 rounded-full border-2 p-0 h-14 ${className}`}
    >
      {options.map((option) => (
        <button
          key={getKey(option)}
          className={`relative z-10 rounded-full px-14 py-4 text-base font-medium capitalize duration-100 ${
            getKey(activeOption) === getKey(option) ? 'text-[#f6f7f8]' : 'text-darkText'
          }`}
          onClick={() => onSwitch(option)}
        >
          {renderOption(option)}
        </button>
      ))}
      <span
        className="absolute left-0 top-0 h-full w-1/2 rounded-full py-2 transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(${
            options.findIndex((opt) => getKey(opt) === getKey(activeOption)) * 100
          }%)`,
        }}
      >
        <span className="absolute inset-0 rounded-full bg-black"></span>
      </span>
    </div>
  );
};
