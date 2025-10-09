import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';
import { Users, Briefcase, BarChart3, Shield } from 'lucide-react';

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  description: string;
  delay: number;
}

const StatItem = ({ icon: Icon, value, suffix = '', label, description, delay }: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="text-center group"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-gradient-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 5 }}
        >
          <Icon className="h-8 w-8 text-primary" />
        </motion.div>
        
        <motion.div
          className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2"
          initial={{ scale: 0.8 }}
          animate={isInView ? { scale: 1 } : { scale: 0.8 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {isInView && (
            <CountUp
              start={0}
              end={value}
              duration={2}
              delay={delay}
              suffix={suffix}
            />
          )}
        </motion.div>
        
        <h3 className="text-lg font-display font-semibold text-foreground mb-1">
          {label}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const AnimatedStats = () => {
  const stats = [
    {
      icon: Users,
      value: 1000,
      suffix: '+',
      label: 'Candidates',
      description: 'Active in pipeline',
      delay: 0.1,
    },
    {
      icon: Briefcase,
      value: 25,
      suffix: '+',
      label: 'Active Jobs',
      description: 'Currently hiring',
      delay: 0.2,
    },
    {
      icon: BarChart3,
      value: 6,
      label: 'Stages',
      description: 'Complete pipeline',
      delay: 0.3,
    },
    {
      icon: Shield,
      value: 100,
      suffix: '%',
      label: 'Local Data',
      description: 'Privacy first',
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative"
    >
      {/* Background Card */}
      <div className="absolute inset-0 bg-gradient-card/50 backdrop-blur-xl rounded-3xl border border-white/10" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Trusted by teams worldwide
          </h2>
          <p className="text-muted-foreground">
            Join thousands of companies already using TalentFlow
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
