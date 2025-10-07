import { useState } from 'react';

interface IUseHoverActions {
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const useHoverActions = (): IUseHoverActions => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return { isHovered, handleMouseEnter, handleMouseLeave };
};

export default useHoverActions;
