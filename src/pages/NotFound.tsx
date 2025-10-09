import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-9xl font-display font-bold gradient-text mb-4"
        >
          404
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-display font-bold text-foreground mb-4"
        >
          Page Not Found
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <Button 
              className="gap-2 font-medium rounded-md transition-colors"
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
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            onClick={() => window.history.back()}
            className="gap-2 font-medium rounded-md transition-colors"
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
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;