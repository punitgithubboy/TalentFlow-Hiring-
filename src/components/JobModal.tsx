import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useJobStore } from '@/stores/jobStore';
import { Job } from '@/lib/db';
import { toast } from 'sonner';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
}

export function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const { createJob, updateJob } = useJobStore();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'active' as 'active' | 'archived',
    description: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        slug: job.slug,
        status: job.status,
        description: job.description || '',
        tags: job.tags,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        status: 'active',
        description: '',
        tags: [],
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (job) {
        await updateJob(job.id, formData);
        toast.success('Job updated successfully');
      } else {
        await createJob({
          ...formData,
          order: 0,
        });
        toast.success('Job created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(job ? 'Failed to update job' : 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-effect animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {job ? 'Edit Job' : 'Create New Job'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="input-premium"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., senior-frontend-developer"
              className="input-premium font-mono"
            />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'archived') => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status" className="input-premium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Job description..."
              rows={4}
              className="input-premium resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                className="input-premium"
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                className="px-6 font-medium rounded-md transition-colors"
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
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
                    {tag}
                    <Button
                      type="button"
                      size="icon"
                      className="h-4 w-4 ml-1 font-medium rounded-md transition-colors"
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
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button 
            onClick={onClose} 
            disabled={isSubmitting} 
            variant="outline"
            className="px-6 font-medium rounded-md transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="px-6 font-medium rounded-md transition-colors bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
