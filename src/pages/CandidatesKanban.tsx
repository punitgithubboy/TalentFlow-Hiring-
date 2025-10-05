import { useEffect, useState } from 'react';
import { useCandidateStore } from '@/stores/candidateStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/db';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

const stages: Array<{ key: Candidate['stage']; label: string; color: string }> = [
  { key: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { key: 'screen', label: 'Screening', color: 'bg-yellow-500' },
  { key: 'tech', label: 'Technical', color: 'bg-purple-500' },
  { key: 'offer', label: 'Offer', color: 'bg-green-500' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-500' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link to={`/candidates/${candidate.id}`}>
        <Card className="p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer">
          <h4 className="text-sm font-semibold text-foreground truncate">{candidate.name}</h4>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{candidate.email}</span>
          </div>
        </Card>
      </Link>
    </div>
  );
}

function DroppableStage({ stage, candidates }: { stage: typeof stages[0]; candidates: Candidate[] }) {
  const { setNodeRef } = useDroppable({
    id: stage.key,
  });

  return (
    <Card ref={setNodeRef} className="p-4 flex flex-col min-h-[500px]">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
          <h3 className="text-sm font-semibold text-foreground">{stage.label}</h3>
        </div>
        <Badge variant="outline">
          {candidates.length}
        </Badge>
      </div>

      <SortableContext
        items={candidates.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto space-y-2">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </SortableContext>
    </Card>
  );
}

export default function CandidatesKanban() {
  const { candidates, isLoading, fetchCandidates, moveCandidateStage } = useCandidateStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage.key] = candidates.filter(c => c.stage === stage.key);
    return acc;
  }, {} as Record<Candidate['stage'], Candidate[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Allow dragging over stage containers
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const candidateId = active.id as string;
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) return;

    // Check if dropped on a stage container or another candidate
    let newStage: Candidate['stage'] | null = null;
    
    // If dropped on another candidate, use that candidate's stage
    const overCandidate = candidates.find(c => c.id === over.id);
    if (overCandidate) {
      newStage = overCandidate.stage;
    } else {
      // Check if dropped on a stage container
      const stage = stages.find(s => over.id === s.key);
      if (stage) {
        newStage = stage.key;
      }
    }

    if (!newStage || candidate.stage === newStage) return;

    try {
      await moveCandidateStage(candidateId, newStage);
      toast.success(`Moved to ${newStage}`);
    } catch (error) {
      toast.error('Failed to move candidate');
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/candidates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Candidates Kanban</h1>
          <p className="text-muted-foreground mt-1">Drag and drop to move candidates between stages</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground mt-4">Loading candidates...</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stages.map((stage) => (
              <DroppableStage
                key={stage.key}
                stage={stage}
                candidates={candidatesByStage[stage.key]}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate ? (
              <Card className="p-3 shadow-lg">
                <h4 className="text-sm font-semibold text-foreground">{activeCandidate.name}</h4>
                <p className="text-xs text-muted-foreground">{activeCandidate.email}</p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
