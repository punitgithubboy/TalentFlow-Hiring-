import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Phone,
  Mail,
  Calendar,
  User,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Candidate } from '@/lib/db';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (candidate: Candidate) => void;
  onMove: (candidateId: string, fromStage: string, toStage: string) => void;
  onDelete?: (candidate: Candidate) => void;
  viewMode: 'grid' | 'list';
}

const stages = [
  { value: 'applied', label: 'Applied', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
  { value: 'screen', label: 'Screening', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
  { value: 'tech', label: 'Technical', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
  { value: 'offer', label: 'Offer', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
  { value: 'hired', label: 'Hired', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
  { value: 'rejected', label: 'Rejected', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600' },
];

export function CandidateCard({ candidate, onEdit, onMove, onDelete, viewMode }: CandidateCardProps) {
  const [isMoving, setIsMoving] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStageInfo = (stage: Candidate['stage']) => {
    return stages.find(s => s.value === stage) || stages[0];
  };

  const getNextStage = (currentStage: Candidate['stage']) => {
    const currentIndex = stages.findIndex(s => s.value === currentStage);
    if (currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return null;
  };

  const getPrevStage = (currentStage: Candidate['stage']) => {
    const currentIndex = stages.findIndex(s => s.value === currentStage);
    if (currentIndex > 0) {
      return stages[currentIndex - 1];
    }
    return null;
  };

  const handleStageChange = async (newStage: string) => {
    if (newStage === candidate.stage) return;
    
    setIsMoving(true);
    try {
      await onMove(candidate.id, candidate.stage, newStage);
    } finally {
      setIsMoving(false);
    }
  };

  const stageInfo = getStageInfo(candidate.stage);
  const nextStage = getNextStage(candidate.stage);
  const prevStage = getPrevStage(candidate.stage);

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="premium-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-display font-semibold text-foreground text-xs truncate">{candidate.name}</h3>
                     {candidate.rating && (
                       <div className="flex items-center gap-1 flex-shrink-0">
                         <Star className="h-3 w-3 fill-white text-white" />
                         <span className="text-xs text-muted-foreground">{candidate.rating}</span>
                       </div>
                     )}
                   </div>
                   <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                  {candidate.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {candidate.phone}
                    </p>
                  )}
                </div>

                {/* Stage */}
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${stageInfo.color}`}>
                    {stageInfo.label}
                  </Badge>
                  
                  {/* Stage Navigation */}
                  <div className="flex items-center gap-1">
                    {prevStage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStageChange(prevStage.value)}
                        disabled={isMoving}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                    )}
                    {nextStage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStageChange(nextStage.value)}
                        disabled={isMoving}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(candidate)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(candidate)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card className="premium-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}

               {/* Name and Rating */}
               <div className="flex-1 min-w-0">
                 <h3 className="font-display font-semibold text-foreground text-xs truncate">{candidate.name}</h3>
                {candidate.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-white text-white" />
                    <span className="text-xs text-muted-foreground">{candidate.rating}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(candidate)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(candidate)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{candidate.phone}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  >
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Stage */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Current Stage</h4>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${stageInfo.color}`}>
                {stageInfo.label}
              </Badge>
              
              {/* Stage Navigation */}
              <div className="flex items-center gap-1 ml-auto">
                {prevStage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStageChange(prevStage.value)}
                    disabled={isMoving}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                )}
                {nextStage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStageChange(nextStage.value)}
                    disabled={isMoving}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Applied {formatDate(candidate.createdAt)}</span>
            </div>
            {candidate.updatedAt !== candidate.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Updated {formatDate(candidate.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
