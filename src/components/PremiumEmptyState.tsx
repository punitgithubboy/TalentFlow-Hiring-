import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const PremiumEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: PremiumEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-16 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-2xl flex items-center justify-center"
      >
        <Icon className="h-12 w-12 text-primary" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-display font-bold text-foreground mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={action.onClick} 
            className="font-medium rounded-md transition-colors"
            style={{ 
              backgroundColor: 'rgb(99, 102, 241)', 
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(79, 70, 229)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(99, 102, 241)';
            }}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Predefined empty states for common scenarios
export const EmptyJobs = ({ onCreateJob }: { onCreateJob: () => void }) => (
  <PremiumEmptyState
    icon={require('lucide-react').Briefcase}
    title="No jobs found"
    description="Get started by creating your first job posting to begin hiring."
    action={{
      label: "Create Your First Job",
      onClick: onCreateJob,
    }}
  />
);

export const EmptyCandidates = ({ onAddCandidate }: { onAddCandidate: () => void }) => (
  <PremiumEmptyState
    icon={require('lucide-react').Users}
    title="No candidates found"
    description="Start building your talent pipeline by adding candidates."
    action={{
      label: "Add Your First Candidate",
      onClick: onAddCandidate,
    }}
  />
);

export const EmptyAssessments = ({ onCreateAssessment }: { onCreateAssessment: () => void }) => (
  <PremiumEmptyState
    icon={require('lucide-react').FileCheck}
    title="No assessments found"
    description="Create custom assessments to evaluate candidates effectively."
    action={{
      label: "Create Your First Assessment",
      onClick: onCreateAssessment,
    }}
  />
);
