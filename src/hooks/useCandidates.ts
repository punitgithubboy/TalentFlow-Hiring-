import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesApi } from '@/lib/api';
import { Candidate } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const candidatesKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidatesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...candidatesKeys.lists(), { filters }] as const,
  details: () => [...candidatesKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidatesKeys.details(), id] as const,
  timeline: (id: string) => [...candidatesKeys.detail(id), 'timeline'] as const,
};

// Get candidates with filters
export function useCandidates(params: {
  search?: string;
  stage?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  return useQuery({
    queryKey: candidatesKeys.list(params),
    queryFn: async () => {
      console.log('useCandidates: Fetching candidates with params:', params);
      try {
        const result = await candidatesApi.getCandidates(params);
        console.log('useCandidates: API response:', result);
        return result;
      } catch (error) {
        console.error('useCandidates: API error:', error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes - data is cached on server
    gcTime: 600000, // 10 minutes - keep in memory longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });
}

// Create candidate mutation
export function useCreateCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: candidatesApi.createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidatesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Candidate created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Update candidate mutation
export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Candidate> }) =>
      candidatesApi.updateCandidate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidatesKeys.lists() });
      toast({
        title: 'Success',
        description: 'Candidate updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Get candidate timeline
export function useCandidateTimeline(candidateId: string) {
  return useQuery({
    queryKey: candidatesKeys.timeline(candidateId),
    queryFn: () => candidatesApi.getCandidateTimeline(candidateId),
    enabled: !!candidateId,
    staleTime: 60000, // 1 minute
  });
}
