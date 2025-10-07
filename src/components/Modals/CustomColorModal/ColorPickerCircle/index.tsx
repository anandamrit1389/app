import { useState } from 'react';
import CircleInCircle from '../CircleInCircle';
import ColorPickerPopover from '../ColorPickerPopover';

interface IProp {
  currentColor: string;
  onColorChange: (newColor: string) => void;
}

const ColorPickerCircle = ({ currentColor, onColorChange }: IProp) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <ColorPickerPopover
      currentColor={currentColor}
      onColorChange={onColorChange}
      isOpen={isOpen}
      onOpenChange={handleToggleOpen}
    >
      <CircleInCircle innerColor={currentColor} onClick={handleToggleOpen} />
    </ColorPickerPopover>
  );
};

export default ColorPickerCircle;
