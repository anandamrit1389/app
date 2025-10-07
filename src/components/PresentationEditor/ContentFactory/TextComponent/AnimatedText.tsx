import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useEffect, useRef, useState } from 'react';

interface IAnimatedProps {
  text: string;
  speed: number;
  classNames?: string;
  delay?: number;
  skipSwitch?: boolean;
}

const AnimatedText = ({
  text,
  classNames,
  speed,
  delay = 0,
  skipSwitch = false,
}: IAnimatedProps) => {
  const [wholeText, setWholeText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState('');
  const { switchToNextElement } = useContext(PresentationContext);

  const currentIndex = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setWholeText(text);
    }, delay);

    return () => clearTimeout(t);
  }, [delay, text]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!wholeText) {
        return;
      }

      if (currentIndex.current < wholeText.length) {
        setDisplayedText(wholeText.slice(0, currentIndex.current + 1));
        currentIndex.current++;
      } else {
        if (!skipSwitch) {
          switchToNextElement?.();
        }
      }
    }, speed);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedText, wholeText, speed, skipSwitch]);

  return <p className={`${classNames}`}>{displayedText}</p>;
};
export default AnimatedText;
