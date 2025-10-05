import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, AssessmentSection, Question } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Trash2, Eye, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { AssessmentPreview } from '@/components/AssessmentPreview';

export default function AssessmentBuilder() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = useLiveQuery(() => db.jobs.get(jobId || ''), [jobId]);
  const existingAssessment = useLiveQuery(
    () => db.assessments.get(`assessment-${jobId}`),
    [jobId]
  );

  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<AssessmentSection[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingAssessment) {
      setTitle(existingAssessment.title);
      setSections(existingAssessment.sections);
    } else if (job) {
      setTitle(`${job.title} Assessment`);
      setSections([
        {
          id: `section-${Date.now()}`,
          title: 'General Questions',
          questions: [],
        },
      ]);
    }
  }, [existingAssessment, job]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section-${Date.now()}`,
        title: 'New Section',
        questions: [],
      },
    ]);
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'short-text',
      text: '',
      required: false,
    };

    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      )
    );
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      )
    );
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      )
    );
  };

  const handleSave = async () => {
    if (!jobId || !title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sections,
          createdAt: existingAssessment?.createdAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to save assessment');

      toast.success('Assessment saved successfully');
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  if (showPreview) {
    return (
      <AssessmentPreview
        title={title}
        sections={sections}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Assessment Builder</h1>
          <p className="text-muted-foreground mt-1">{job.title}</p>
        </div>
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Assessment'}
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Frontend Developer Assessment"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <Input
                value={section.title}
                onChange={(e) =>
                  updateSection(section.id, { title: e.target.value })
                }
                placeholder="Section Title"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {section.questions.map((question, questionIndex) => (
                <Card key={question.id} className="p-4 bg-muted/50">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Q{questionIndex + 1}
                          </span>
                          <Select
                            value={question.type}
                            onValueChange={(value: Question['type']) =>
                              updateQuestion(section.id, question.id, { type: value })
                            }
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short-text">Short Text</SelectItem>
                              <SelectItem value="long-text">Long Text</SelectItem>
                              <SelectItem value="single-choice">Single Choice</SelectItem>
                              <SelectItem value="multi-choice">Multi Choice</SelectItem>
                              <SelectItem value="numeric">Numeric</SelectItem>
                              <SelectItem value="file-upload">File Upload</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Textarea
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(section.id, question.id, {
                              text: e.target.value,
                            })
                          }
                          placeholder="Question text"
                          rows={2}
                        />

                        {(question.type === 'single-choice' ||
                          question.type === 'multi-choice') && (
                          <Textarea
                            value={question.options?.join('\n') || ''}
                            onChange={(e) =>
                              updateQuestion(section.id, question.id, {
                                options: e.target.value
                                  .split('\n')
                                  .filter((o) => o.trim()),
                              })
                            }
                            placeholder="Options (one per line)"
                            rows={4}
                          />
                        )}

                        {question.type === 'numeric' && (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={question.validation?.min || ''}
                              onChange={(e) =>
                                updateQuestion(section.id, question.id, {
                                  validation: {
                                    ...question.validation,
                                    min: Number(e.target.value),
                                  },
                                })
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={question.validation?.max || ''}
                              onChange={(e) =>
                                updateQuestion(section.id, question.id, {
                                  validation: {
                                    ...question.validation,
                                    max: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`required-${question.id}`}
                            checked={question.required}
                            onCheckedChange={(checked) =>
                              updateQuestion(section.id, question.id, {
                                required: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor={`required-${question.id}`}>Required</Label>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteQuestion(section.id, question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => addQuestion(section.id)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addSection} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
}
