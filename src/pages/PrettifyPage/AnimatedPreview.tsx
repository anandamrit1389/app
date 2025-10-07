import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IProps {
  previews: any;
}

function AnimatedPreview({ previews }: IProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        console.log((prevIndex + 1) % previews.length);
        return (prevIndex + 1) % previews.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-block min-h-[100px] min-w-[200px] overflow-visible align-top leading-[1.2]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 0, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 0, opacity: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="inline-block rounded-xl overflow-hidden h-[300px]"
        >
          <img
            src={previews?.[currentIndex]?.image?.imageUrl}
            alt={previews?.[currentIndex]?.slideType}
            className="w-full h-full object-contain inline-block rounded-xl"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AnimatedPreview;
