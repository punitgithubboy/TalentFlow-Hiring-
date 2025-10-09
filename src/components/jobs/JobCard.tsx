import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MoreHorizontal, 
  Edit, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  GripVertical,
  Calendar,
  Users,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Job } from '@/lib/db';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onToggleArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
  onReorder: (jobId: string, fromOrder: number, toOrder: number) => void;
}

export function JobCard({ job, onEdit, onToggleArchive, onDelete, onReorder }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Job['status']) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-red-500/10 text-red-300 border-red-500/20';
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      <Card className={`premium-card transition-all duration-300 ${
        isDragging ? 'shadow-glow-lg scale-105' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-display font-semibold text-white mb-2 line-clamp-2">
                {job.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(job.status)}`}
                >
                  {job.status === 'active' ? 'Active' : 'Archived'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(job)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleArchive(job)}>
                    {job.status === 'active' ? (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </>
                    ) : (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        Restore
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(job)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {job.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {job.description}
            </p>
          )}

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {job.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {job.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created {formatDate(job.createdAt)}</span>
              </div>
              {job.updatedAt !== job.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(job.updatedAt)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>0 candidates</span>
            </div>
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
