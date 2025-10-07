import { PresentationContext } from '@/contexts/Presentation.context';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Rnd } from 'react-rnd';
import Rotatable from './Rotatable';

interface IProps {
  contentId: string;
  isActive: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onActivate: (val: string | null) => void;
  positionJson?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  isPreview?: boolean;
  minWidth?: number;
  minHeight?: number;
  onUpdatePosition: (posJson: string) => void;
  children: React.ReactNode;
  borderRadius?: string;
  bgEnabled?: boolean;
  verticalAlign?: string;
  contentType?: string;
  isBlockOpen?: boolean;
  isTextEditing?: boolean;
}

const Draggable = ({
  contentId,
  positionJson,
  containerRef,
  isPreview,
  minWidth = 100,
  minHeight = 50,
  onUpdatePosition,
  children,
  borderRadius,
  bgEnabled,
  verticalAlign,
  isActive,
  isEditing,
  setIsEditing,
  onActivate,
  contentType,
  isBlockOpen,
  isTextEditing,
}: IProps) => {
  const parsePosition = (pos?: string) => {
    if (!pos) return {};
    try {
      return JSON.parse(pos);
    } catch {
      return {};
    }
  };

  const percentToPx = (percent?: string, base?: number) =>
    percent && base ? (parseFloat(percent) / 100) * base : 0;

  const {
    isSideBarActive,
    setActiveImage,
    activeImage,
    activeSlide,
    setActiveSlide,
    isFullscreen,
  } = useContext(PresentationContext);

  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sizeRef = useRef<{ width: number; height: any }>({
    width: minWidth,
    height: minHeight,
  });

  const [rotation, setRotation] = useState(0);
  const [storedPositionJson, setStoredPositionJson] = useState(positionJson);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState<{ width: number; height: any }>({
    width: minWidth,
    height: minHeight,
  });
  const innerRef = useRef<HTMLDivElement>(null);

  const parsed = parsePosition(positionJson);

  const updatePosition = (x: number, y: number) => {
    const newPosition = { x, y };
    positionRef.current = newPosition;
    setPosition(newPosition);
  };

  const updateSize = (width: number, height: number) => {
    const newSize = { width, height };
    sizeRef.current = newSize;
    setSize(newSize);
  };

  const recalculatePosition = () => {
    const container = containerRef.current;
    if (!container || !positionJson) return;

    const rect = container.getBoundingClientRect();
    const pos = parsePosition(storedPositionJson);

    const newPosition = {
      x: percentToPx(pos.left, rect.width),
      y: percentToPx(pos.top, rect.height),
    };

    const newSize = {
      width: percentToPx(pos.width, rect.width) || minWidth,
      height: contentType === 'text' ? 'auto' : percentToPx(pos.height, rect.height) || minHeight,
    };

    positionRef.current = newPosition;
    sizeRef.current = newSize;
    setPosition(newPosition);
    setSize(newSize);
  };

  useEffect(() => {
    savePosition(
      positionRef.current.x,
      positionRef.current.y,
      sizeRef.current.width,
      sizeRef.current.height,
      borderRadius,
      bgEnabled,
      verticalAlign,
    );
  }, [bgEnabled, borderRadius, verticalAlign]);

  useEffect(() => {
    if (parsed.rotation !== undefined) {
      setRotation(parsed.rotation);
    }
  }, [parsed.rotation]);

  useEffect(() => {
    if (positionJson && positionJson !== storedPositionJson) {
      setStoredPositionJson(positionJson);
    }
  }, [positionJson]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (innerRef.current && !innerRef.current?.contains(target)) {
        if (activeImage && !isSideBarActive) {
          setActiveImage(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeImage, isSideBarActive]);

  useEffect(() => {
    recalculatePosition();

    const resizeObserver = new ResizeObserver(() => {
      recalculatePosition();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', recalculatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', recalculatePosition);
    };
  }, [positionJson]);

  const isText = contentType === 'text' || contentType === 'list-item';

  // Calculate measured text height
  const measuredTextHeight = isText && innerRef.current ? innerRef.current.offsetHeight : minHeight;

  useEffect(() => {    
    if (isText && innerRef.current) {
      const measuredHeight = innerRef.current.offsetHeight;

      if (size.height !== measuredTextHeight) {
        setSize((prev) => ({ ...prev, height: measuredHeight }));
      }
    }
  }, [isText, measuredTextHeight]);

  const savePosition = (
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius?: string,
    bgEnabled?: boolean,
    verticalAlign?: string,
  ) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const storedPosition = storedPositionJson ? JSON.parse(storedPositionJson) : {};

    const newPos = {
      ...storedPosition,
      top: `${((y / rect.height) * 100).toFixed(2)}%`,
      left: `${((x / rect.width) * 100).toFixed(2)}%`,
      width: `${((width / rect.width) * 100).toFixed(2)}%`,
      height: `${((height / rect.height) * 100).toFixed(2)}%`,
      borderRadius: borderRadius ?? 0,
      bgEnabled: bgEnabled ?? true,
      verticalAlign: verticalAlign ?? 'start',
    };

    const newJson = JSON.stringify(newPos);

    if (activeSlide) {
      const updatedContent =
        activeSlide &&
        activeSlide.content.map((c) => {
          if (c.id === contentId) {
            return {
              ...c,
              position: newJson,
            };
          }
          return c;
        });
      setActiveSlide({ ...activeSlide, content: updatedContent });
    }

    setStoredPositionJson(newJson);
    onUpdatePosition(JSON.stringify(newPos));
  };

  const enableResizing = isText
    ? {
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }
    : true;

  if (isPreview) {
    const parsed = parsePosition(positionJson);
    const radius =
      borderRadius && (parseFloat(borderRadius) > 100 || isFullscreen) ? borderRadius : '3px';

    return (
      <div  
        className="absolute"
        style={{
          top: parsed.top,
          left: parsed.left,
          width: parsed.width,
          height: parsed.height,
          borderRadius: radius,
          overflow: !isText ? "hidden" : "visible",
        }}
      >
        {isText ? (
          <div ref={innerRef} style={{borderRadius: radius, overflow: 'hidden'}}>
            {children}
          </div>
          ) : 
          children
        }
      </div>
    );
  }

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(_e, data) => {
        savePosition(data.x, data.y, size.width, size.height, borderRadius, bgEnabled);
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        savePosition(pos.x, pos.y, ref.offsetWidth, ref.offsetHeight, borderRadius, bgEnabled);
      }}
      onDrag={(_e, data) => updatePosition(data.x, data.y)}
      onResize={(_e, _dir, ref) => updateSize(ref.offsetWidth, ref.offsetHeight)}
      bounds="parent"
      disableDragging={isPreview || (isText && isTextEditing)}
      enableResizing={!isPreview && enableResizing}
      minWidth={minWidth}
      minHeight={isText ? measuredTextHeight : minHeight}
      onMouseDown={() => {
        onActivate?.(contentId);
      }}
      resizeHandleWrapperStyle={{
        transform: `rotate(${rotation}deg)`,
        width: size.width + 5,
        height: size.height + 5,
        position: 'absolute',
        top: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      resizeHandleStyles={{
        top: { pointerEvents: 'auto' },
        bottom: { pointerEvents: 'auto' },
        left: { pointerEvents: 'auto' },
        right: { pointerEvents: 'auto' },
        topLeft: { pointerEvents: 'auto' },
        topRight: { pointerEvents: 'auto' },
        bottomLeft: { pointerEvents: 'auto' },
        bottomRight: { pointerEvents: 'auto' },
      }}
      lockAspectRatio={contentType === 'shape'}
      style={{
        zIndex: isActive ? 20 : 10,
      }}
      cancel=".no-drag"
    >
      <div
        className="size-full"
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseEnter={() => {
          if (!isPreview && !isEditing) {
            onActivate(contentId);
            setIsEditing(true);
          }
        }}
        onMouseLeave={() => {
          if (!isPreview && !isBlockOpen) {
            setIsEditing(false);
            onActivate(null);
          }
        }}
      >
        <Rotatable
          rotation={rotation}
          setRotation={setRotation}
          isEditing={isEditing}
          onUpdatePosition={onUpdatePosition}
          isActive={isActive}
          contentId={contentId}
          posJson={positionJson}
        >
          <div ref={innerRef} className={'size-full'}>
            {children}
          </div>
        </Rotatable>
      </div>
    </Rnd>
  );
};

export default Draggable;
