import { useEffect, useState } from 'react';
import { useJobStore } from '@/stores/jobStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Archive, ArchiveRestore, Edit, GripVertical, Briefcase } from 'lucide-react';
import { JobModal } from '@/components/JobModal';
import { Job } from '@/lib/db';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SortableJobCard = ({ job, onEdit, onArchive }: { job: Job; onEdit: (job: Job) => void; onArchive: (job: Job) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link to={`/jobs/${job.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">/{job.slug}</p>
                {job.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(job)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onArchive(job)}
                >
                  {job.status === 'active' ? (
                    <Archive className="h-4 w-4" />
                  ) : (
                    <ArchiveRestore className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
              {job.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function Jobs() {
  const {
    jobs,
    isLoading,
    error,
    filters,
    totalPages,
    setFilters,
    fetchJobs,
    updateJob,
    reorderJob,
  } = useJobStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchJobs();
  }, [filters, fetchJobs]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex((job) => job.id === active.id);
    const newIndex = jobs.findIndex((job) => job.id === over.id);

    try {
      await reorderJob(active.id as string, oldIndex, newIndex);
      toast.success('Job reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder job. Changes reverted.');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleArchive = async (job: Job) => {
    try {
      await updateJob(job.id, {
        status: job.status === 'active' ? 'archived' : 'active',
      });
      toast.success(
        job.status === 'active' ? 'Job archived successfully' : 'Job restored successfully'
      );
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage and organize job postings</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          <Select value={filters.status || "all"} onValueChange={(value) => setFilters({ status: value === "all" ? "" : value, page: 1 })}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground mt-4">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
          <p className="text-muted-foreground mt-2">
            {filters.search || filters.status
              ? 'Try adjusting your filters'
              : 'Get started by creating your first job'}
          </p>
        </Card>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
              <motion.div 
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <SortableJobCard job={job} onEdit={handleEdit} onArchive={handleArchive} />
                  </motion.div>
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters({ page: filters.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === totalPages}
                onClick={() => setFilters({ page: filters.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <JobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        job={editingJob}
      />
    </div>
  );
}
