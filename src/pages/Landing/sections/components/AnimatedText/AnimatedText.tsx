import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedText() {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });
  const words = [
    t('animatedWords.enhancer'),
    t('animatedWords.optimiser'),
    t('animatedWords.creator'),
    t('animatedWords.designer'),
    t('animatedWords.coach'),
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-block min-h-[100px] min-w-[200px] overflow-visible align-top leading-[1.2]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWordIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="gradient-text inline-block"
          style={{ display: 'inline-block', overflow: 'visible' }}
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default AnimatedText;
