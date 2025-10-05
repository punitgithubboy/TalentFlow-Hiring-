import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { AssessmentSection } from '@/lib/db';

interface AssessmentPreviewProps {
  title: string;
  sections: AssessmentSection[];
  onClose: () => void;
}

export function AssessmentPreview({ title, sections, onClose }: AssessmentPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">Preview Mode</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {sections.map((section) => (
          <Card key={section.id} className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {section.title}
            </h2>

            <div className="space-y-6">
              {section.questions.map((question, index) => {
                if (!shouldShowQuestion(question)) return null;

                return (
                  <div key={question.id} className="space-y-2">
                    <Label>
                      {index + 1}. {question.text}
                      {question.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>

                    {question.type === 'short-text' && (
                      <Input
                        value={responses[question.id] || ''}
                        onChange={(e) =>
                          setResponses({ ...responses, [question.id]: e.target.value })
                        }
                        maxLength={question.validation?.maxLength}
                      />
                    )}

                    {question.type === 'long-text' && (
                      <Textarea
                        value={responses[question.id] || ''}
                        onChange={(e) =>
                          setResponses({ ...responses, [question.id]: e.target.value })
                        }
                        maxLength={question.validation?.maxLength}
                        rows={4}
                      />
                    )}

                    {question.type === 'single-choice' && (
                      <RadioGroup
                        value={responses[question.id] || ''}
                        onValueChange={(value) =>
                          setResponses({ ...responses, [question.id]: value })
                        }
                      >
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === 'multi-choice' && (
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${question.id}-${option}`}
                              checked={
                                responses[question.id]?.includes(option) || false
                              }
                              onCheckedChange={(checked) => {
                                const current = responses[question.id] || [];
                                const updated = checked
                                  ? [...current, option]
                                  : current.filter((o: string) => o !== option);
                                setResponses({ ...responses, [question.id]: updated });
                              }}
                            />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'numeric' && (
                      <Input
                        type="number"
                        value={responses[question.id] || ''}
                        onChange={(e) =>
                          setResponses({ ...responses, [question.id]: e.target.value })
                        }
                        min={question.validation?.min}
                        max={question.validation?.max}
                      />
                    )}

                    {question.type === 'file-upload' && (
                      <Input
                        type="file"
                        onChange={(e) =>
                          setResponses({
                            ...responses,
                            [question.id]: e.target.files?.[0]?.name || '',
                          })
                        }
                      />
                    )}

                    {errors[question.id] && (
                      <p className="text-sm text-destructive">{errors[question.id]}</p>
                    )}

                    {question.validation?.maxLength && (
                      <p className="text-xs text-muted-foreground">
                        {(responses[question.id] || '').length} /{' '}
                        {question.validation.maxLength} characters
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button type="submit">Validate Form</Button>
        </div>
      </form>
    </div>
  );
}
