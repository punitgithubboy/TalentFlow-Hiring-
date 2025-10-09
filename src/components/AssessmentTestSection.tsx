import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Type, 
  FileText, 
  Hash, 
  Upload, 
  Clock, 
  Users, 
  Star,
  Play,
  Settings,
  Eye
} from 'lucide-react';

interface AssessmentTest {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Technical' | 'Behavioral' | 'Mixed';
  icon: React.ComponentType<any>;
}

const assessmentTests: AssessmentTest[] = [
  {
    id: 'tech-frontend',
    name: 'Frontend Development',
    description: 'Test React, JavaScript, CSS, and modern frontend technologies',
    duration: 45,
    questions: 25,
    difficulty: 'Medium',
    type: 'Technical',
    icon: CheckSquare,
  },
  {
    id: 'tech-backend',
    name: 'Backend Development',
    description: 'Test Node.js, databases, APIs, and server-side technologies',
    duration: 60,
    questions: 30,
    difficulty: 'Hard',
    type: 'Technical',
    icon: Hash,
  },
  {
    id: 'tech-fullstack',
    name: 'Full Stack Development',
    description: 'Comprehensive test covering both frontend and backend skills',
    duration: 90,
    questions: 50,
    difficulty: 'Hard',
    type: 'Technical',
    icon: FileText,
  },
  {
    id: 'behavioral',
    name: 'Behavioral Assessment',
    description: 'Evaluate soft skills, communication, and cultural fit',
    duration: 30,
    questions: 15,
    difficulty: 'Easy',
    type: 'Behavioral',
    icon: Users,
  },
  {
    id: 'mixed',
    name: 'Mixed Assessment',
    description: 'Combination of technical and behavioral questions',
    duration: 75,
    questions: 40,
    difficulty: 'Medium',
    type: 'Mixed',
    icon: Star,
  },
];

interface AssessmentTestSectionProps {
  jobId: string;
  jobTitle: string;
  onSelectTest: (testId: string, jobId: string) => void;
  onCreateCustom?: (jobId: string) => void;
}

export function AssessmentTestSection({ jobId, jobTitle, onSelectTest, onCreateCustom }: AssessmentTestSectionProps) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100';
      case 'Medium': return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Hard': return 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100';
      case 'Behavioral': return 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100';
      case 'Mixed': return 'bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100';
      default: return 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Assessment Test for {jobTitle}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Select a pre-built assessment template or create a custom one
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessmentTests.map((test) => {
          const Icon = test.icon;
          const isSelected = selectedTest === test.id;
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                    : 'hover:shadow-lg hover:border-blue-300 border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => setSelectedTest(isSelected ? null : test.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">{test.name}</CardTitle>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{test.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                    <Badge className={getTypeColor(test.type)}>
                      {test.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckSquare className="h-4 w-4" />
                      <span className="font-medium">{test.questions} questions</span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Use This Test clicked:', { testId: test.id, jobId });
                            onSelectTest(test.id, jobId);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Use This Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Preview functionality
                          }}
                          className="border-2 border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Customize functionality
                          }}
                          className="border-2 border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          size="lg" 
          className="border-2 border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
          onClick={() => {
            console.log('Create Custom Assessment clicked:', { jobId });
            onCreateCustom?.(jobId);
          }}
        >
          <FileText className="h-5 w-5 mr-2" />
          Create Custom Assessment
        </Button>
      </div>
    </div>
  );
}
