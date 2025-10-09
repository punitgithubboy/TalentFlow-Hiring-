import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X as XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useJobs } from '@/hooks/useJobs';
import { Candidate, Job } from '@/lib/db';

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
  onSave: (candidateData: Partial<Candidate>) => void;
}

const stages = [
  { value: 'applied', label: 'Applied' },
  { value: 'screen', label: 'Screening' },
  { value: 'tech', label: 'Technical' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const sources = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Referral',
  'Glassdoor',
  'AngelList',
  'Other'
];

export function CandidateFormModal({ isOpen, onClose, candidate, onSave }: CandidateFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    stage: 'applied' as Candidate['stage'],
    experience: '',
    skills: [] as string[],
    notes: '',
    source: '',
    rating: undefined as number | undefined,
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch jobs for the dropdown
  const { data: jobsData } = useJobs({ pageSize: 1000 });
  const jobs = jobsData?.data || [];

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || '',
        jobId: candidate.jobId,
        stage: candidate.stage,
        experience: candidate.experience || '',
        skills: candidate.skills || [],
        notes: candidate.notes || '',
        source: candidate.source || '',
        rating: candidate.rating,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobId: '',
        stage: 'applied',
        experience: '',
        skills: [],
        notes: '',
        source: '',
        rating: undefined,
      });
    }
  }, [candidate]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Candidate name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.jobId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a job',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save candidate',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-effect max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {candidate ? 'Edit Candidate' : 'Add New Candidate'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Doe"
                  className="input-premium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., john@example.com"
                  className="input-premium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="input-premium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobId">Job *</Label>
                <Select
                  value={formData.jobId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, jobId: value }))}
                >
                  <SelectTrigger className="input-premium">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value: Candidate['stage']) => 
                    setFormData(prev => ({ ...prev, stage: value }))
                  }
                >
                  <SelectTrigger className="input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger className="input-premium">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 5 years in React development"
                className="input-premium"
              />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="input-premium"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the candidate..."
                className="input-premium resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Select
                value={formData.rating?.toString() || ''}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  rating: value ? parseInt(value) : undefined 
                }))}
              >
                <SelectTrigger className="input-premium">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white hover:bg-primary/90"
                style={{
                  backgroundColor: '#6366f1 !important',
                  color: '#ffffff !important',
                  border: 'none !important',
                  opacity: '1 !important'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.setProperty('background-color', '#4f46e5', 'important');
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.setProperty('background-color', '#6366f1', 'important');
                  }
                }}
              >
                {loading ? 'Saving...' : candidate ? 'Update Candidate' : 'Add Candidate'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
