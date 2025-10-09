import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';

interface PremiumLoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export const PremiumLoadingScreen = ({ isLoading, onComplete }: PremiumLoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center animated-bg"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-8 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
            >
              <Briefcase className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            {/* App Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-display font-bold gradient-text mb-8"
            >
              TalentFlow
            </motion.h1>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-64 mx-auto mb-4"
            >
              <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground"
            >
              {progress < 30 && "Initializing..."}
              {progress >= 30 && progress < 60 && "Loading data..."}
              {progress >= 60 && progress < 90 && "Preparing interface..."}
              {progress >= 90 && "Almost ready..."}
            </motion.p>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
