import { motion } from 'framer-motion';
import { Heart, Users, Award, Shield } from 'lucide-react';

export const HumanTouch = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center mb-8"
    >
      {/* Human-centered tagline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/10 border border-white/20 text-white text-sm font-medium mb-6"
      >
        <Heart className="h-4 w-4" />
        Made by recruiters, for recruiters
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8"
      >
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-400" />
          <span>Enterprise Ready</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Trusted by section
export const TrustedBy = () => {
  const companies = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'StartupXYZ', logo: 'SX' },
    { name: 'InnovateLab', logo: 'IL' },
    { name: 'FutureCo', logo: 'FC' },
    { name: 'NextGen', logo: 'NG' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="text-center mb-16"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-muted-foreground text-sm mb-6"
      >
        Trusted by top companies worldwide
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="flex flex-wrap items-center justify-center gap-8 opacity-60"
      >
        {companies.map((company, index) => (
          <motion.div
            key={company.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
            className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
          >
            <span className="text-lg font-bold text-foreground">
              {company.logo}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
