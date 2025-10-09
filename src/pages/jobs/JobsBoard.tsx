import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Search, Filter, Archive, ArchiveRestore, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { JobFormModal } from '@/components/jobs/JobFormModal';
import { JobCard } from '@/components/jobs/JobCard';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob, useReorderJobs } from '@/hooks/useJobs';
import { Job } from '@/lib/db';

export default function JobsBoard() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // React Query hooks
  const { data: jobsData, isLoading, error } = useJobs({
    search,
    status: status === 'all' ? undefined : status,
    page,
    pageSize: 10,
  });

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();
  const reorderJobsMutation = useReorderJobs();

  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.totalPages || 1;

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  const handleJobSaved = (jobData: Partial<Job>) => {
    if (editingJob) {
      updateJobMutation.mutate({
        id: editingJob.id,
        data: jobData,
      });
    } else {
      createJobMutation.mutate({
        title: jobData.title || '',
        slug: jobData.slug || '',
        status: jobData.status || 'active',
        description: jobData.description,
        tags: jobData.tags || [],
      });
    }
    setShowJobModal(false);
    setEditingJob(null);
  };

  const handleDeleteJob = async (id: string) => {
    deleteJobMutation.mutate(id);
  };

  const handleToggleArchive = async (job: Job) => {
    updateJobMutation.mutate({
      id: job.id,
      data: {
        status: job.status === 'active' ? 'archived' : 'active',
      },
    });
  };

  const handleReorder = async (jobId: string, oldIndex: number, newIndex: number) => {
    reorderJobsMutation.mutate({
      id: jobId,
      fromOrder: oldIndex,
      toOrder: newIndex,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = jobs.findIndex(job => job.id === active.id);
      const newIndex = jobs.findIndex(job => job.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorder(active.id as string, oldIndex, newIndex);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">Error Loading Jobs</h1>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
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
              Try Again
            </Button>
          </div>
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
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
                Jobs
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your job postings and track applications
              </p>
            </div>
            <Button 
              onClick={handleCreateJob} 
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
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 animate-fade-up stagger-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-[200px] input-premium">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Jobs Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="premium-card p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-2xl flex items-center justify-center">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                No jobs found
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                {search || status !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first job posting'
                }
              </p>
              {(!search && status === 'all') && (
                <Button 
                  onClick={handleCreateJob} 
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
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Job
                </Button>
              )}
            </motion.div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover-lift"
                      >
                        <JobCard
                          job={job}
                          onEdit={handleEditJob}
                          onToggleArchive={handleToggleArchive}
                          onDelete={handleDeleteJob}
                          onReorder={handleReorder}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className="w-10 h-10 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setEditingJob(null);
          }}
          job={editingJob}
          onSave={handleJobSaved}
        />
      </div>
    </div>
  );
}
