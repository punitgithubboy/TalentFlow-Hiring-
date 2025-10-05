import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, FileText } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const job = useLiveQuery(() => db.jobs.get(id || ''), [id]);
  const candidates = useLiveQuery(() => db.candidates.where('jobId').equals(id || '').toArray(), [id]);

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-muted-foreground mt-4">Loading job...</p>
      </div>
    );
  }

  const candidatesByStage = {
    applied: candidates?.filter(c => c.stage === 'applied').length || 0,
    screen: candidates?.filter(c => c.stage === 'screen').length || 0,
    tech: candidates?.filter(c => c.stage === 'tech').length || 0,
    offer: candidates?.filter(c => c.stage === 'offer').length || 0,
    hired: candidates?.filter(c => c.stage === 'hired').length || 0,
    rejected: candidates?.filter(c => c.stage === 'rejected').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
          <p className="text-muted-foreground mt-1">/{job.slug}</p>
        </div>
        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
          {job.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Job Details</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground mt-1">{job.description || 'No description provided'}</p>
            </div>

            {job.tags.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Candidates</h2>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Applied</span>
              <Badge variant="outline">{candidatesByStage.applied}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Screening</span>
              <Badge variant="outline">{candidatesByStage.screen}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Technical</span>
              <Badge variant="outline">{candidatesByStage.tech}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Offer</span>
              <Badge variant="outline">{candidatesByStage.offer}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hired</span>
              <Badge variant="default">{candidatesByStage.hired}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rejected</span>
              <Badge variant="secondary">{candidatesByStage.rejected}</Badge>
            </div>
          </div>

          <Link to={`/candidates?jobId=${job.id}`} className="mt-4 block">
            <Button className="w-full" variant="outline">
              View All Candidates
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Assessment</h2>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="text-muted-foreground mb-4">
          Create and manage assessments for this position to evaluate candidates consistently.
        </p>

        <Link to={`/assessments/${job.id}`}>
          <Button>
            Manage Assessment
          </Button>
        </Link>
      </Card>
    </div>
  );
}
