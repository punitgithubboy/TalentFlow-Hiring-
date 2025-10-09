import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { Assessment, AssessmentSection } from '@/lib/db';

interface AssessmentPreviewProps {
  assessment: Assessment | null;
  onClose?: () => void;
}

export function AssessmentPreview({ assessment, onClose }: AssessmentPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!assessment) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No assessment to preview</p>
      </div>
    );
  }

  const { title, sections } = assessment;

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    sections.forEach((section) => {
      section.questions.forEach((question) => {
        // Check conditional logic
        if (question.conditionalOn) {
          const conditionMet =
            responses[question.conditionalOn.questionId] ===
            question.conditionalOn.answer;
          if (!conditionMet) return;
        }

        // Validate required fields
        if (question.required && !responses[question.id]) {
          newErrors[question.id] = 'This field is required';
        }

        // Validate numeric range
        if (question.type === 'numeric' && responses[question.id]) {
          const value = Number(responses[question.id]);
          if (question.validation?.min && value < question.validation.min) {
            newErrors[question.id] = `Minimum value is ${question.validation.min}`;
          }
          if (question.validation?.max && value > question.validation.max) {
            newErrors[question.id] = `Maximum value is ${question.validation.max}`;
          }
        }

        // Validate text length
        if (
          (question.type === 'short-text' || question.type === 'long-text') &&
          responses[question.id]
        ) {
          const length = responses[question.id].length;
          if (question.validation?.maxLength && length > question.validation.maxLength) {
            newErrors[question.id] = `Maximum ${question.validation.maxLength} characters`;
          }
          if (question.validation?.minLength && length < question.validation.minLength) {
            newErrors[question.id] = `Minimum ${question.validation.minLength} characters`;
          }
        }
      });
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Validation passed! (This is a preview)');
    }
  };

  const shouldShowQuestion = (question: any) => {
    if (!question.conditionalOn) return true;

    return responses[question.conditionalOn.questionId] === question.conditionalOn.answer;
  };

  const renderQuestion = (question: any) => {
    if (!shouldShowQuestion(question)) return null;

    return (
      <div key={question.id} className="space-y-2">
        <Label className="text-sm font-medium">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {question.type === 'single-choice' && (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => setResponses(prev => ({ ...prev, [question.id]: value }))}
          >
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'multi-choice' && (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={responses[question.id]?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = responses[question.id] || [];
                    if (checked) {
                      setResponses(prev => ({
                        ...prev,
                        [question.id]: [...currentValues, option]
                      }));
                    } else {
                      setResponses(prev => ({
                        ...prev,
                        [question.id]: currentValues.filter((v: string) => v !== option)
                      }));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'short-text' && (
          <Input
            value={responses[question.id] || ''}
            onChange={(e) => setResponses(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Enter your answer..."
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'long-text' && (
          <Textarea
            value={responses[question.id] || ''}
            onChange={(e) => setResponses(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Enter your answer..."
            rows={4}
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'numeric' && (
          <Input
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => setResponses(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Enter a number..."
            min={question.validation?.min}
            max={question.validation?.max}
          />
        )}

        {question.type === 'file-upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              id={question.id}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResponses(prev => ({ ...prev, [question.id]: file.name }));
                }
              }}
            />
            <Label htmlFor={question.id} className="cursor-pointer">
              <div className="text-sm text-muted-foreground">
                {responses[question.id] ? `Selected: ${responses[question.id]}` : 'Click to upload file'}
              </div>
            </Label>
          </div>
        )}

        {errors[question.id] && (
          <p className="text-sm text-red-500">{errors[question.id]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">Preview Mode</p>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {sections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                )}
              </div>

              <div className="space-y-4">
                {section.questions.map(renderQuestion)}
              </div>
            </div>
          </Card>
        ))}

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-8 py-2 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              border: 'none',
              opacity: '1'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6366f1';
            }}
          >
            Submit Assessment
          </button>
        </div>
      </form>
    </div>
  );
}