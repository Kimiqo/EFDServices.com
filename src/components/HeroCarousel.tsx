import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { heroImages } from '../data/heroImages';

const GRID_SIZE = 9; // 3 rows x 3 columns
const STEP_MS = 1000; // time per image animation step

function shuffleArray<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HeroCarousel: React.FC = () => {
  // take first GRID_SIZE images (or pad if fewer)
  const initial = useMemo(() => heroImages.slice(0, GRID_SIZE), []);
  const [images, setImages] = useState<string[]>(() => {
    if (initial.length >= GRID_SIZE) return initial.slice(0, GRID_SIZE);
    // pad with repeats if not enough images
    const padded = [...initial];
    while (padded.length < GRID_SIZE) padded.push(initial[padded.length % initial.length] || '');
    return padded;
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    let idx = 0;
    setActiveIndex(0);
    const interval = setInterval(() => {
      idx = (idx + 1) % images.length;
      setActiveIndex(idx);

      if (idx === 0) {
        setImages((prev) => shuffleArray(prev));
      }
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-[440px] sm:h-[520px] overflow-visible rounded-lg">
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0">
        {images.map((src, idx) => {
          // single active image at a time
          const isActive = idx === activeIndex;
          return (
            <motion.div
              key={idx}
              className="relative overflow-visible h-full"
              style={{ placeSelf: 'stretch' }}
              animate={{
                scale: isActive ? 1.09 : 1,
                zIndex: isActive ? 50 : 1,
                boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.28)' : '0 2px 8px rgba(0,0,0,0.06)'
              }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              <motion.img
                src={src}
                alt={`Hero ${idx + 1}`}
                className="w-full h-full object-cover rounded-md border border-white/10"
                draggable={false}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%'
                }}
                initial={false}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroCarousel;