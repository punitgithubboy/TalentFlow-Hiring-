import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  slug: string;
  status: string;
  tags: string[];
  order: number;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

interface Assessment {
  id: string;
  jobId: string;
  title: string;
  sections: any[];
  createdAt: number;
  updatedAt: number;
}

export default function Assessments() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Use Dexie in development, API in production
  const devJobs = useLiveQuery(() => db.jobs.where('status').equals('active').toArray(), []);
  const devAssessments = useLiveQuery(() => db.assessments.toArray(), []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Use Dexie data in development
      if (devJobs) setJobs(devJobs);
      if (devAssessments) setAssessments(devAssessments);
      setLoading(false);
    } else {
      // Use API in production
      const fetchData = async () => {
        try {
          // Fetch active jobs
          const jobsResponse = await fetch('/api/jobs?status=active');
          const jobsData = await jobsResponse.json();
          setJobs(jobsData.data || []);

          // Fetch assessments
          const assessmentsResponse = await fetch('/api/assessments');
          const assessmentsData = await assessmentsResponse.json();
          setAssessments(assessmentsData.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [devJobs, devAssessments]);

  const jobsWithAssessments = jobs?.map(job => ({
    ...job,
    hasAssessment: assessments?.some(a => a.jobId === job.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage assessments for job positions
          </p>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-muted-foreground mt-2">
            Fetching jobs and assessments
          </p>
        </Card>
      ) : !jobsWithAssessments || jobsWithAssessments.length === 0 ? (
        <Card className="p-12 text-center">
          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No active jobs</h3>
          <p className="text-muted-foreground mt-2">
            Create active jobs first to set up assessments
          </p>
          <Link to="/jobs" className="inline-block mt-4">
            <Button>Go to Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobsWithAssessments.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">/{job.slug}</p>
                </div>
                {job.hasAssessment && (
                  <Badge variant="default" className="ml-2">
                    Active
                  </Badge>
                )}
              </div>

              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Link to={`/assessments/${job.id}`}>
                <Button className="w-full" variant={job.hasAssessment ? 'outline' : 'default'}>
                  {job.hasAssessment ? (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Edit Assessment
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assessment
                    </>
                  )}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
