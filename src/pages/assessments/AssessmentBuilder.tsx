import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Save, 
  Eye, 
  ArrowLeft, 
  Trash2, 
  GripVertical,
  Settings,
  FileText,
  CheckSquare,
  Type,
  Hash,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { AssessmentPreview } from '@/components/AssessmentPreview';
import { useAssessment, useSaveAssessment } from '@/hooks/useAssessments';
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence';
import { useJobs } from '@/hooks/useJobs';
import { Assessment, AssessmentSection, Question } from '@/lib/db';

const questionTypes = [
  { value: 'single-choice' as const, label: 'Single Choice', icon: CheckSquare },
  { value: 'multi-choice' as const, label: 'Multiple Choice', icon: CheckSquare },
  { value: 'short-text' as const, label: 'Short Text', icon: Type },
  { value: 'long-text' as const, label: 'Long Text', icon: FileText },
  { value: 'numeric' as const, label: 'Numeric', icon: Hash },
  { value: 'file-upload' as const, label: 'File Upload', icon: Upload },
];

// Test templates
const testTemplates = {
  'tech-frontend': {
    title: 'Frontend Development Assessment',
    sections: [
      {
        id: 'section-1',
        title: 'JavaScript Fundamentals',
        questions: [
          {
            id: 'q-1',
            text: 'What is the difference between let, const, and var?',
            type: 'long-text' as const,
            required: true,
            validation: { minLength: 50, maxLength: 500 },
          },
          {
            id: 'q-2',
            text: 'Explain closures in JavaScript',
            type: 'long-text' as const,
            required: true,
            validation: { minLength: 100, maxLength: 1000 },
          },
        ],
      },
      {
        id: 'section-2',
        title: 'React & Modern Frameworks',
        questions: [
          {
            id: 'q-3',
            text: 'What is the difference between functional and class components?',
            type: 'single-choice' as const,
            required: true,
            options: [
              'Functional components are faster',
              'Class components have lifecycle methods',
              'No difference',
              'Functional components use hooks'
            ],
          },
        ],
      },
    ],
  },
  'tech-backend': {
    title: 'Backend Development Assessment',
    sections: [
      {
        id: 'section-1',
        title: 'API Design',
        questions: [
          {
            id: 'q-1',
            text: 'Explain RESTful API principles',
            type: 'long-text' as const,
            required: true,
            validation: { minLength: 100, maxLength: 1000 },
          },
        ],
      },
    ],
  },
  'behavioral': {
    title: 'Behavioral Assessment',
    sections: [
      {
        id: 'section-1',
        title: 'Communication & Teamwork',
        questions: [
          {
            id: 'q-1',
            text: 'Describe a time when you had to work with a difficult team member',
            type: 'long-text' as const,
            required: true,
            validation: { minLength: 200, maxLength: 1000 },
          },
        ],
      },
    ],
  },
};

export default function AssessmentBuilder() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  // Get test parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get('test');

  // React Query hooks
  const { data: job, isLoading: jobLoading } = useJobs({ pageSize: 1000 });
  const { data: existingAssessment, isLoading: assessmentLoading } = useAssessment(jobId || '');
  const saveAssessmentMutation = useSaveAssessment();

  // Local persistence hook
  const { assessment, setAssessment, updateAssessment, isLoading: persistenceLoading } = useAssessmentPersistence(jobId || '');

  const currentJob = job?.data?.find(j => j.id === jobId);


  useEffect(() => {
    console.log('AssessmentBuilder useEffect:', { 
      existingAssessment: !!existingAssessment, 
      currentJob: !!currentJob, 
      assessment: !!assessment, 
      testId,
      jobId 
    });

    if (existingAssessment && !assessment) {
      console.log('Loading existing assessment');
      setAssessment(existingAssessment);
    } else if (currentJob && !assessment) {
      console.log('Creating new assessment for job:', currentJob.title);
      
      // Check if we have a test template to load
      if (testId && testTemplates[testId as keyof typeof testTemplates]) {
        console.log('Loading test template:', testId);
        const template = testTemplates[testId as keyof typeof testTemplates];
        setAssessment({
          id: `assessment-${jobId}`,
          jobId: jobId || '',
          title: template.title,
          sections: template.sections,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        console.log('Creating custom assessment');
        // Create new assessment if none exists
        setAssessment({
          id: `assessment-${jobId}`,
          jobId: jobId || '',
          title: `${currentJob.title} Assessment`,
          sections: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  }, [existingAssessment, currentJob, jobId, assessment, setAssessment, testId]);

  const addSection = () => {
    if (!assessment) return;
    
    updateAssessment({
      sections: [
        ...assessment.sections,
        {
          id: `section-${Date.now()}`,
          title: `Section ${assessment.sections.length + 1}`,
          questions: [],
        },
      ],
    });
  };

  const removeSection = (sectionId: string) => {
    if (!assessment) return;
    
    updateAssessment({
      sections: assessment.sections.filter(s => s.id !== sectionId),
    });
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!assessment) return;
    
    updateAssessment({
      sections: assessment.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const addQuestion = (sectionId: string) => {
    if (!assessment) return;
    
    updateAssessment({
      sections: assessment.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: [
                ...s.questions,
                {
                  id: `question-${Date.now()}`,
                  text: 'New Question',
                  type: 'short-text' as const,
                  required: false,
                  options: [],
                  validation: {},
                },
              ],
            }
          : s
      ),
    });
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    if (!assessment) return;
    
    updateAssessment({
      sections: assessment.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.filter(q => q.id !== questionId),
            }
          : s
      ),
    });
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    if (!assessment) return;
    
    updateAssessment({
      sections: assessment.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      ),
    });
  };

  const handleSave = () => {
    if (!assessment) return;
    
    console.log('Saving assessment:', { jobId, assessment });
    saveAssessmentMutation.mutate({
      jobId: jobId || '',
      data: {
        title: assessment.title,
        sections: assessment.sections,
      },
    });
  };

  // Conditional questions logic
  const shouldShowQuestion = (question: Question, responses: Record<string, any>) => {
    if (!question.conditionalOn) return true;
    
    const { questionId, answer } = question.conditionalOn;
    const response = responses[questionId];
    
    if (Array.isArray(answer)) {
      return Array.isArray(response) ? 
        answer.some(a => response.includes(a)) : 
        answer.includes(response);
    }
    
    return response === answer;
  };

  const isLoading = jobLoading || assessmentLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/3 mb-8" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The job you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/assessments')}>
              Back to Assessments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment && !persistenceLoading) {
    // Create a new assessment if none exists
    const newAssessment = {
      id: `assessment-${jobId}`,
      jobId: jobId || '',
      title: `${currentJob?.title || 'Job'} Assessment`,
      sections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAssessment(newAssessment);
    
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Creating New Assessment</h1>
            <p className="text-muted-foreground mb-4">
              Setting up a new assessment for this job...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if persistence is still loading
  if (persistenceLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading Assessment</h1>
            <p className="text-muted-foreground mb-4">
              Loading your assessment data...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Final fallback - if assessment is still null, create a basic one
  if (!assessment) {
    console.log('Creating fallback assessment');
    const fallbackAssessment = {
      id: `assessment-${jobId}`,
      jobId: jobId || '',
      title: testId && testTemplates[testId as keyof typeof testTemplates] 
        ? testTemplates[testId as keyof typeof testTemplates].title
        : `${currentJob?.title || 'Job'} Assessment`,
      sections: testId && testTemplates[testId as keyof typeof testTemplates]
        ? testTemplates[testId as keyof typeof testTemplates].sections
        : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAssessment(fallbackAssessment);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {testId ? 'Loading Test Template' : 'Creating Assessment'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {testId ? `Loading ${testTemplates[testId as keyof typeof testTemplates]?.title || 'test template'}...` : 'Setting up your assessment...'}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/assessments')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
                  Assessment Builder
                </h1>
                <p className="text-muted-foreground text-lg">
                  Create assessment for: {currentJob.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
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
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveAssessmentMutation.isPending}
                className="font-medium rounded-md transition-colors"
                style={{ 
                  backgroundColor: 'rgb(99, 102, 241)', 
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'rgb(79, 70, 229)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(99, 102, 241)';
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveAssessmentMutation.isPending ? 'Saving...' : 'Save Assessment'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Builder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Assessment Title */}
            <Card className="premium-card p-6">
              <div className="space-y-4">
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  value={assessment?.title || ''}
                  onChange={(e) => setAssessment(prev => prev ? { ...prev, title: e.target.value, updatedAt: Date.now() } : null)}
                  placeholder="Enter assessment title..."
                  className="input-premium"
                />
              </div>
            </Card>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-semibold text-foreground">
                  Sections
                </h3>
                <Button onClick={addSection} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <AnimatePresence>
                {assessment?.sections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <Card className="premium-card p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-display font-semibold text-foreground">
                            Section {sectionIndex + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                            <Input
                              id={`section-title-${section.id}`}
                              value={section.title}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="Enter section title..."
                              className="input-premium"
                            />
                          </div>


                          {/* Questions */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-md font-medium text-foreground">Questions</h5>
                              <Button
                                onClick={() => addQuestion(section.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                              </Button>
                            </div>

                            {section.questions.map((question, questionIndex) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-border rounded-lg p-4 space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h6 className="text-sm font-medium text-foreground">
                                    Question {questionIndex + 1}
                                  </h6>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuestion(section.id, question.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor={`question-text-${question.id}`}>Question Text</Label>
                                    <Input
                                      id={`question-text-${question.id}`}
                                      value={question.text}
                                      onChange={(e) => updateQuestion(section.id, question.id, { text: e.target.value })}
                                      placeholder="Enter question..."
                                      className="input-premium"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
                                    <Select
                                      value={question.type}
                                      onValueChange={(value: Question['type']) => updateQuestion(section.id, question.id, { type: value })}
                                    >
                                      <SelectTrigger className="input-premium">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {questionTypes.map((type) => {
                                          const Icon = type.icon;
                                          return (
                                            <SelectItem key={type.value} value={type.value}>
                                              <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {type.label}
                                              </div>
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id={`question-required-${question.id}`}
                                      checked={question.required}
                                      onCheckedChange={(checked) => updateQuestion(section.id, question.id, { required: checked })}
                                    />
                                    <Label htmlFor={`question-required-${question.id}`}>Required</Label>
                                  </div>

                                  {/* Conditional Question Setup */}
                                  <div className="space-y-3">
                                    <Label className="text-sm font-medium">Conditional Logic</Label>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`question-conditional-${question.id}`}
                                          checked={!!question.conditionalOn}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              updateQuestion(section.id, question.id, {
                                                conditionalOn: {
                                                  questionId: '',
                                                  answer: ''
                                                }
                                              });
                                            } else {
                                              updateQuestion(section.id, question.id, {
                                                conditionalOn: undefined
                                              });
                                            }
                                          }}
                                        />
                                        <Label htmlFor={`question-conditional-${question.id}`}>
                                          Show this question conditionally
                                        </Label>
                                      </div>
                                      
                                      {question.conditionalOn && (
                                        <div className="space-y-2 pl-6 border-l-2 border-border">
                                          <div>
                                            <Label className="text-xs">Show when this question:</Label>
                                            <Select
                                              value={question.conditionalOn.questionId}
                                              onValueChange={(value) => updateQuestion(section.id, question.id, {
                                                conditionalOn: {
                                                  ...question.conditionalOn!,
                                                  questionId: value
                                                }
                                              })}
                                            >
                                              <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Select question" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {assessment.sections
                                                  .flatMap(s => s.questions)
                                                  .filter(q => q.id !== question.id)
                                                  .map(q => (
                                                    <SelectItem key={q.id} value={q.id}>
                                                      {q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text}
                                                    </SelectItem>
                                                  ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          
                                          <div>
                                            <Label className="text-xs">Has this answer:</Label>
                                            <Input
                                              value={Array.isArray(question.conditionalOn.answer) 
                                                ? question.conditionalOn.answer.join(', ') 
                                                : question.conditionalOn.answer}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const answer = value.includes(',') 
                                                  ? value.split(',').map(v => v.trim())
                                                  : value;
                                                updateQuestion(section.id, question.id, {
                                                  conditionalOn: {
                                                    ...question.conditionalOn!,
                                                    answer
                                                  }
                                                });
                                              }}
                                              placeholder="Enter answer(s), comma-separated for multiple"
                                              className="h-8 text-xs"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-8 lg:h-fit"
            >
              <Card className="premium-card p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    Live Preview
                  </h3>
                  <AssessmentPreview assessment={assessment} onClose={() => setShowPreview(false)} />
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
