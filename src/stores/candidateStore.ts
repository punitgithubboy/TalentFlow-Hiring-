import { create } from 'zustand';
import { Candidate, TimelineEvent } from '@/lib/db';

interface CandidateState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  timeline: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    stage: string;
    page: number;
    pageSize: number;
  };
  totalPages: number;
  setcandidates: (candidates: Candidate[]) => void;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  setTimeline: (timeline: TimelineEvent[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<CandidateState['filters']>) => void;
  setTotalPages: (totalPages: number) => void;
  fetchCandidates: () => Promise<void>;
  fetchCandidateTimeline: (id: string) => Promise<void>;
  updateCandidate: (id: string, updates: Partial<Candidate>) => Promise<void>;
  moveCandidateStage: (id: string, newStage: Candidate['stage']) => Promise<void>;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: [],
  selectedCandidate: null,
  timeline: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    stage: '',
    page: 1,
    pageSize: 50,
  },
  totalPages: 1,

  setcandidates: (candidates) => set({ candidates }),
  setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),
  setTimeline: (timeline) => set({ timeline }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setTotalPages: (totalPages) => set({ totalPages }),

  fetchCandidates: async () => {
    const { filters, setLoading, setError, setcandidates, setTotalPages } = get();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.stage) params.append('stage', filters.stage);
      params.append('page', filters.page.toString());
      params.append('pageSize', filters.pageSize.toString());

      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');

      const data = await response.json();
      setcandidates(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  },

  fetchCandidateTimeline: async (id) => {
    const { setLoading, setError, setTimeline } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${id}/timeline`);
      if (!response.ok) throw new Error('Failed to fetch timeline');

      const data = await response.json();
      setTimeline(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  },

  updateCandidate: async (id, updates) => {
    const { setLoading, setError, fetchCandidates } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update candidate');
      await fetchCandidates();
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  moveCandidateStage: async (id, newStage) => {
    const { updateCandidate } = get();
    await updateCandidate(id, { stage: newStage });
  },
}));
