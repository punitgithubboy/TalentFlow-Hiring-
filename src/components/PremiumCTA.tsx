import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';

export const PremiumCTA = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
    >
      {/* Primary CTA */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/jobs">
          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-medium rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="flex items-center gap-2 relative z-10"
              animate={isHovered ? { x: 2 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-5 w-5" />
              Start Hiring
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Button>
        </Link>
      </motion.div>

    </motion.div>
  );
};

// Scroll indicator component
export const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
