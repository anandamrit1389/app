import { Slider } from "@/components/ui/slider";
import { ISlide } from "@/interfaces/ISlides";
import { FontSizeMap } from "@/interfaces/IUsePresentation";
import { useEffect, useState } from "react";

interface IProps {
  slide: ISlide,
  fontSizes: FontSizeMap,
  setFontSizes: (val: FontSizeMap) => void;
  onUpdate: (val: ISlide) => void;
}

const FontSlider = ({ slide, fontSizes, setFontSizes, onUpdate}: IProps) => {
  const [font, setFont] = useState(0.8);
  
   useEffect(() => {
    if (slide && slide.slideType === 'free-slide') {
      const textSize = fontSizes[slide.id]?.text;
      textSize && setFont(textSize);
    }
  }, [slide]);
  
  const handleFontSizeChange = (value: number[]) => {
    const newFontSize = value[0];
    setFont(newFontSize);
    updateFontSize(newFontSize);
  };

  const updateFontSize = (size: number) => {
    if (!slide) return;
    const newFontSize: FontSizeMap = {};

    const updatedContent = slide.content.map((c) => {
      if (c.contentType === 'text') {
        const pos = c.position && JSON.parse(c.position);

        pos.fontSizeTitle = size;
        pos.fontSizeSubtitle = size;
        pos.fontSizeText = size;
        setFontSizes(pos);

        newFontSize[slide.id] = {
          title: size,
          subtitle: size,
          text: size,
        };

        return {
          ...c,
          position: JSON.stringify(pos),
        };
      }
      return c;
    });

    setFontSizes({
      ...fontSizes,
      [slide.id]: {
        title: size,
        subtitle: size,
        text: size,
      },
    });
    onUpdate?.({ ...slide, content: updatedContent });
  };

  return (
    <div className="flex items-center gap-2 text-darkText">
      <span className="text-sm font-bold">A</span>
        <Slider
          value={[font]}
          max={4}
          min={0.4}
          step={0.1}
          onValueChange={handleFontSizeChange}
          className="flex-1 z-10"
        />
      <span className="text-xl font-bold">A</span>
    </div>
  )
}

export default FontSlider;