import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { Job } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const jobsKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...jobsKeys.lists(), { filters }] as const,
  details: () => [...jobsKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobsKeys.details(), id] as const,
};

// Get jobs with filters
export function useJobs(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
} = {}) {
  return useQuery({
    queryKey: jobsKeys.list(params),
    queryFn: () => jobsApi.getJobs(params),
    staleTime: 300000, // 5 minutes - data is cached on server
    gcTime: 600000, // 10 minutes - keep in memory longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
  });
}

// Create job mutation
export function useCreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      toast({
        title: 'Success',
        description: 'Job created successfully',
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

// Update job mutation
export function useUpdateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsApi.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      toast({
        title: 'Success',
        description: 'Job updated successfully',
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

// Reorder jobs mutation
export function useReorderJobs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, fromOrder, toOrder }: { id: string; fromOrder: number; toOrder: number }) =>
      jobsApi.reorderJobs(id, fromOrder, toOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
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

// Delete job mutation
export function useDeleteJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
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
