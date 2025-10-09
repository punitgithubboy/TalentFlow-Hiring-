import { http, HttpResponse, delay } from 'msw';
import { db, Job, Candidate } from '../db';

const BASE_URL = '/api';

// Helper to simulate network delay
async function simulateNetwork() {
  const delayTime = Math.random() * 200 + 50; // 50-250ms (much faster)
  await delay(delayTime);
}

// Helper to simulate random errors on write operations
function shouldError() {
  return Math.random() < 0.02; // 2% error rate (much lower)
}

export const handlers = [
  // Jobs endpoints
  http.get(`${BASE_URL}/jobs`, async ({ request }) => {
    console.log('MSW: Intercepted GET /api/jobs');
    try {
      await simulateNetwork();

      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

      console.log('MSW: Fetching jobs from database...');
      let jobs = await db.jobs.toArray();
      console.log('MSW: Found', jobs.length, 'jobs');

      // Filter
      if (search) {
        jobs = jobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status) {
        jobs = jobs.filter(job => job.status === status);
      }

      // Sort by order
      jobs.sort((a, b) => a.order - b.order);

      // Paginate
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = jobs.slice(start, end);

      console.log('MSW: Returning', paginatedJobs.length, 'jobs for page', page);

      return HttpResponse.json({
        data: paginatedJobs,
        total: jobs.length,
        page,
        pageSize,
        totalPages: Math.ceil(jobs.length / pageSize),
      });
    } catch (error) {
      console.error('MSW: Error fetching jobs:', error);
      return HttpResponse.json({ 
        error: 'Failed to fetch jobs', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }),

  http.post(`${BASE_URL}/jobs`, async ({ request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to create job' }, { status: 500 });
      }

      const body = await request.json() as Partial<Job>;
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: body.title || '',
        slug: body.slug || '',
        status: body.status || 'active',
        tags: body.tags || [],
        order: body.order || 0,
        description: body.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.jobs.add(newJob);
      return HttpResponse.json(newJob, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
  }),

  http.patch(`${BASE_URL}/jobs/:id`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to update job' }, { status: 500 });
      }

      const { id } = params;
      const updates = await request.json() as Partial<Job>;

      await db.jobs.update(id as string, {
        ...updates,
        updatedAt: Date.now(),
      });

      const job = await db.jobs.get(id as string);
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
  }),

  http.patch(`${BASE_URL}/jobs/:id/reorder`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to reorder jobs' }, { status: 500 });
      }

      const { id } = params;
      const { fromOrder, toOrder } = await request.json() as { fromOrder: number; toOrder: number };

      const jobs = await db.jobs.orderBy('order').toArray();
      const job = jobs.find(j => j.id === id);

      if (!job) {
        return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      // Reorder logic
      const updates: Array<{ id: string; order: number }> = [];

      if (fromOrder < toOrder) {
        // Moving down
        jobs.forEach(j => {
          if (j.id === id) {
            updates.push({ id: j.id, order: toOrder });
          } else if (j.order > fromOrder && j.order <= toOrder) {
            updates.push({ id: j.id, order: j.order - 1 });
          }
        });
      } else {
        // Moving up
        jobs.forEach(j => {
          if (j.id === id) {
            updates.push({ id: j.id, order: toOrder });
          } else if (j.order >= toOrder && j.order < fromOrder) {
            updates.push({ id: j.id, order: j.order + 1 });
          }
        });
      }

      // Apply updates
      for (const update of updates) {
        await db.jobs.update(update.id, { order: update.order, updatedAt: Date.now() });
      }

      return HttpResponse.json({ success: true });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to reorder job' }, { status: 500 });
    }
  }),

  // Candidates endpoints
  http.get(`${BASE_URL}/candidates`, async ({ request }) => {
    console.log('MSW: Intercepted GET /api/candidates');
    try {
      await simulateNetwork();

      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const stage = url.searchParams.get('stage') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

      let candidates = await db.candidates.toArray();

      // Filter
      if (search) {
        candidates = candidates.filter(candidate =>
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (stage) {
        candidates = candidates.filter(candidate => candidate.stage === stage);
      }

      // Paginate
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCandidates = candidates.slice(start, end);

      return HttpResponse.json({
        data: paginatedCandidates,
        total: candidates.length,
        page,
        pageSize,
        totalPages: Math.ceil(candidates.length / pageSize),
      });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
    }
  }),

  http.post(`${BASE_URL}/candidates`, async ({ request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
      }

      const body = await request.json() as Partial<Candidate>;
      const newCandidate: Candidate = {
        id: `candidate-${Date.now()}`,
        name: body.name || '',
        email: body.email || '',
        stage: body.stage || 'applied',
        jobId: body.jobId || '',
        phone: body.phone,
        resume: body.resume,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.candidates.add(newCandidate);
      return HttpResponse.json(newCandidate, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
  }),

  http.patch(`${BASE_URL}/candidates/:id`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
      }

      const { id } = params;
      const updates = await request.json() as Partial<Candidate>;

      // If stage changed, add timeline event
      if (updates.stage) {
        const candidate = await db.candidates.get(id as string);
        if (candidate && candidate.stage !== updates.stage) {
          await db.timeline.add({
            id: `timeline-${id}-${Date.now()}`,
            candidateId: id as string,
            type: 'stage_change',
            fromStage: candidate.stage,
            toStage: updates.stage,
            createdAt: Date.now(),
            createdBy: 'HR Team',
          });
        }
      }

      await db.candidates.update(id as string, {
        ...updates,
        updatedAt: Date.now(),
      });

      const candidate = await db.candidates.get(id as string);
      return HttpResponse.json(candidate);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
    }
  }),

  // Move candidate between stages (for kanban board)
  http.patch(`${BASE_URL}/candidates/:id/move`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to move candidate' }, { status: 500 });
      }

      const { id } = params;
      const { fromStage, toStage } = await request.json() as { fromStage: string; toStage: string };

      const candidate = await db.candidates.get(id as string);
      if (!candidate) {
        return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
      }

      // Add timeline event for stage change
      await db.timeline.add({
        id: `timeline-${id}-${Date.now()}`,
        candidateId: id as string,
        type: 'stage_change',
        fromStage: fromStage as any,
        toStage: toStage as any,
        createdAt: Date.now(),
        createdBy: 'HR Team',
      });

      // Update candidate stage
      await db.candidates.update(id as string, {
        stage: toStage as any,
        updatedAt: Date.now(),
      });

      const updatedCandidate = await db.candidates.get(id as string);
      return HttpResponse.json(updatedCandidate);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to move candidate' }, { status: 500 });
    }
  }),

  http.get(`${BASE_URL}/candidates/:id/timeline`, async ({ params }) => {
    try {
      await simulateNetwork();

      const { id } = params;
      const events = await db.timeline
        .where('candidateId')
        .equals(id as string)
        .toArray();

      events.sort((a, b) => b.createdAt - a.createdAt);

      return HttpResponse.json(events);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
    }
  }),

  // Assessments endpoints
  http.get(`${BASE_URL}/assessments/:jobId`, async ({ params }) => {
    try {
      await simulateNetwork();

      const { jobId } = params;
      const assessment = await db.assessments.get(`assessment-${jobId}`);

      if (!assessment) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json(assessment);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
    }
  }),

  http.put(`${BASE_URL}/assessments/:jobId`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
      }

      const { jobId } = params;
      const body = await request.json() as any;

      const assessment = {
        id: `assessment-${jobId}`,
        jobId: jobId as string,
        title: body.title,
        sections: body.sections,
        createdAt: body.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await db.assessments.put(assessment);
      return HttpResponse.json(assessment);
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
    }
  }),

  http.post(`${BASE_URL}/assessments/:jobId/submit`, async ({ params, request }) => {
    try {
      await simulateNetwork();
      
      if (shouldError()) {
        return HttpResponse.json({ error: 'Failed to submit assessment' }, { status: 500 });
      }

      const { jobId } = params;
      const body = await request.json() as any;

      const response = {
        id: `response-${Date.now()}`,
        assessmentId: `assessment-${jobId}`,
        candidateId: body.candidateId,
        responses: body.responses,
        completedAt: Date.now(),
      };

      await db.assessmentResponses.add(response);
      return HttpResponse.json(response, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to submit assessment' }, { status: 500 });
    }
  }),
];
