import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, X as XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/db';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  onSave: (jobData: Partial<Job>) => void;
}

export function JobFormModal({ isOpen, onClose, job, onSave }: JobFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'active' as Job['status'],
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        slug: job.slug,
        description: job.description || '',
        status: job.status,
        tags: job.tags,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        status: 'active',
        tags: [],
      });
    }
  }, [job]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Job title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Job slug is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save job',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-effect border-white/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-foreground gradient-text">
              {job ? 'Edit Job' : 'Create New Job'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer"
                  className="input-premium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., senior-frontend-developer"
                  className="input-premium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="input-premium resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Job['status']) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="input-premium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="input-premium"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="btn-premium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="btn-premium"
              >
                {loading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
