import { Button } from '@/components/ui/button';
import { PresentationContext } from '@/contexts/Presentation.context';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

interface IProps {
  rotation: number;
  setRotation: (val: number) => void;
  children: React.ReactNode;
  isEditing: boolean;
  onUpdatePosition: (val: string) => void;
  isActive: boolean;
  contentId: string;
  posJson?: string;
}

const Rotatable = ({
  rotation,
  setRotation,
  children,
  isEditing,
  onUpdatePosition,
  isActive,
  contentId,
  posJson,
}: IProps) => {
  const { activeSlide, setActiveSlide } = useContext(PresentationContext);
  const innerRef = useRef<HTMLDivElement>(null);

  const [isRotating, setIsRotating] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRotation, setStartRotation] = useState(0);

  useEffect(() => {
    if (posJson) {
      const pos = JSON.parse(posJson);
      setRotation(pos.rotation || 0);
    }
  }, [posJson]);

  const getAngle = (x: number, y: number, cx: number, cy: number) => {
    const dx = x - cx;
    const dy = y - cy;
    const radians = Math.atan2(dy, dx);
    return (radians * 180) / Math.PI;
  };

  const saveRotation = () => {
    if (!posJson) return;
    let storedPosition;
    try {
      storedPosition = JSON.parse(posJson);
    } catch {
      storedPosition = {};
    }

    const roundedRotation = Math.round(rotation * 100) / 100;

    const newPos = {
      ...storedPosition,
      rotation: roundedRotation,
    };

    const newJson = JSON.stringify(newPos);

    if (activeSlide) {
      const updatedContent = activeSlide.content.map((c) =>
        c.id === contentId ? { ...c, position: newJson } : c,
      );
      setActiveSlide({ ...activeSlide, content: updatedContent });
    }

    onUpdatePosition(newJson);
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!innerRef.current) return;

    const rect = innerRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const angle = getAngle(e.clientX, e.clientY, center.x, center.y);
    setStartAngle(angle);
    setStartRotation(rotation);
    setIsRotating(true);
  };

  const SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  const SNAP_THRESHOLD = 5;

  const snapToAngle = (angle: number) => {
    for (const snapAngle of SNAP_ANGLES) {
      const diff = Math.abs(angle - snapAngle);
      if (diff < SNAP_THRESHOLD) {
        return snapAngle;
      }
    }
    return angle;
  };

  useEffect(() => {
    if (!isRotating) return;

    if (!innerRef.current) return;

    const rect = innerRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentAngle = getAngle(e.clientX, e.clientY, center.x, center.y);
      let delta = currentAngle - startAngle;
      let newRotation = startRotation + delta;
      newRotation = (newRotation + 360) % 360;

      newRotation = snapToAngle(newRotation);

      setRotation(newRotation);
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      saveRotation();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, startAngle, startRotation, rotation]);

  return (
    <div ref={innerRef} className="size-full relative">
      {children}

      {isEditing && isActive && (
        <Button
          onMouseDown={handleRotateStart}
          className="absolute top-1 right-1 h-auto p-0 bg-transparent rounded-full cursor-pointer text-normalText text-xl no-drag"
        >
          <RotateCw className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default Rotatable;
