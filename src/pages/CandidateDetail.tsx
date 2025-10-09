import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCandidateStore } from '@/stores/candidateStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Candidate } from '@/lib/db';

const stageColors: Record<Candidate['stage'], string> = {
  applied: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  screen: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  tech: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  offer: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  hired: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const { timeline, moveCandidateStage, fetchCandidateTimeline } = useCandidateStore();
  const candidate = useLiveQuery(() => db.candidates.get(id || ''), [id]);
  const job = useLiveQuery(() => candidate ? db.jobs.get(candidate.jobId) : undefined, [candidate]);
  
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchCandidateTimeline(id);
    }
  }, [id, fetchCandidateTimeline]);

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-muted-foreground mt-4">Loading candidate...</p>
      </div>
    );
  }

  const handleStageChange = async (newStage: Candidate['stage']) => {
    try {
      await moveCandidateStage(candidate.id, newStage);
      toast.success('Candidate stage updated');
      fetchCandidateTimeline(candidate.id);
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    try {
      await db.timeline.add({
        id: `timeline-${candidate.id}-${Date.now()}`,
        candidateId: candidate.id,
        type: 'note_added',
        note: note.trim(),
        createdAt: Date.now(),
        createdBy: 'HR Team',
      });

      toast.success('Note added');
      setNote('');
      fetchCandidateTimeline(candidate.id);
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/candidates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
          {job && (
            <p className="text-muted-foreground mt-1">
              Applying for <Link to={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${candidate.email}`} className="text-sm text-foreground hover:underline">
                {candidate.email}
              </a>
            </div>

            {candidate.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${candidate.phone}`} className="text-sm text-foreground hover:underline">
                  {candidate.phone}
                </a>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Applied {new Date(candidate.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Stage</h2>

          <div className="space-y-4">
            <Select value={candidate.stage} onValueChange={handleStageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screen">Screening</SelectItem>
                <SelectItem value="tech">Technical</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Badge className={`${stageColors[candidate.stage]} w-full justify-center py-2`}>
              {candidate.stage.toUpperCase()}
            </Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Notes & Activity
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note... (use @name to mention someone)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} disabled={!note.trim()}>
              Add Note
            </Button>
          </div>

          {timeline.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {timeline.map((event) => (
                <div key={event.id} className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {event.type === 'stage_change' && (
                        <p className="text-sm text-foreground">
                          Stage changed from{' '}
                          <Badge variant="outline" className="mx-1">
                            {event.fromStage}
                          </Badge>{' '}
                          to{' '}
                          <Badge variant="outline" className="mx-1">
                            {event.toStage}
                          </Badge>
                        </p>
                      )}
                      {event.type === 'note_added' && (
                        <p className="text-sm text-foreground">{event.note}</p>
                      )}
                      {event.type === 'assessment_completed' && (
                        <p className="text-sm text-foreground">Completed assessment</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.createdAt).toLocaleString()} • {event.createdBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
