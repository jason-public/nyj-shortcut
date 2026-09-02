import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  threshold?: number;
  offsetBottomClass?: string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 250,
  offsetBottomClass = 'bottom-6'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }

      if (scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG circular progress calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`fixed right-6 ${offsetBottomClass} z-40 no-print flex flex-col items-center group`}
        >
          <button
            id="scroll-to-top-button"
            onClick={scrollToTop}
            aria-label="페이지 맨 위로 이동"
            title="맨 위로 이동 (Scroll to Top)"
            className="relative w-12 h-12 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-lg hover:shadow-xl shadow-slate-900/10 dark:shadow-black/40 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {/* Circular Progress Indicator Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
            >
              {/* Background Track */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-200/60 dark:stroke-slate-700/60 fill-none"
                strokeWidth="2.5"
              />
              {/* Active Progress */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-blue-600 dark:stroke-blue-400 fill-none transition-all duration-100"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Up Arrow Icon */}
            <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>

          {/* Floating Tooltip Label */}
          <span className="absolute -top-8 px-2 py-0.5 text-[11px] font-bold text-white bg-slate-900 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-sm whitespace-nowrap">
            맨 위로
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
