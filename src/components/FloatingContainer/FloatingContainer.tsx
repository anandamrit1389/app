import { useRef, useEffect, CSSProperties, ReactNode, useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';

interface IProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode | ReactNode[];
}

const FloatingContainer = ({ x, y, isOpen, onClose, children }: IProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isSideBarActive, setActiveImage, activeImage } = useContext(PresentationContext);

  const style: CSSProperties = {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 100,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
        if (activeImage && !isSideBarActive) {
          setActiveImage(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeImage]);

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={menuRef} style={style} className="z-[1000] transition-all">
      {children}
    </div>
  );
};

export default FloatingContainer;
