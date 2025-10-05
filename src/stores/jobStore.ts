import { create } from 'zustand';
import { Job } from '@/lib/db';

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    page: number;
    pageSize: number;
  };
  totalPages: number;
  setJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<JobState['filters']>) => void;
  setTotalPages: (totalPages: number) => void;
  fetchJobs: () => Promise<void>;
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  reorderJob: (id: string, fromOrder: number, toOrder: number) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    page: 1,
    pageSize: 10,
  },
  totalPages: 1,

  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setTotalPages: (totalPages) => set({ totalPages }),

  fetchJobs: async () => {
    const { filters, setLoading, setError, setJobs, setTotalPages } = get();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      params.append('page', filters.page.toString());
      params.append('pageSize', filters.pageSize.toString());

      console.log('Fetching jobs from:', `/api/jobs?${params}`);
      const response = await fetch(`/api/jobs?${params}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        // Try to parse error response
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `Failed to fetch jobs: ${response.status} ${response.statusText}`);
        } catch {
          throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Expected JSON but got:', responseText.substring(0, 200));
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      console.log('Jobs data received:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setJobs(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Fetch jobs error:', error);
      setError((error as Error).message);
      
      // Set empty state on error
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  },

  createJob: async (job) => {
    const { setLoading, setError, fetchJobs } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (!response.ok) throw new Error('Failed to create job');
      await fetchJobs();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updateJob: async (id, updates) => {
    const { setLoading, setError, fetchJobs } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update job');
      await fetchJobs();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  reorderJob: async (id, fromOrder, toOrder) => {
    const { setError, jobs, setJobs } = get();

    // Optimistic update
    const oldJobs = [...jobs];
    const updatedJobs = [...jobs];
    const jobIndex = updatedJobs.findIndex(j => j.id === id);

    if (jobIndex === -1) return;

    const [movedJob] = updatedJobs.splice(jobIndex, 1);
    const newIndex = toOrder;
    updatedJobs.splice(newIndex, 0, movedJob);
    
    // Update order values
    updatedJobs.forEach((job, index) => {
      job.order = index;
    });

    setJobs(updatedJobs);

    try {
      const response = await fetch(`/api/jobs/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromOrder, toOrder }),
      });

      if (!response.ok) {
        // Rollback on failure
        setJobs(oldJobs);
        throw new Error('Failed to reorder job');
      }
    } catch (error) {
      setJobs(oldJobs);
      setError((error as Error).message);
      throw error;
    }
  },
}));
