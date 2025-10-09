import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const assessmentsKeys = {
  all: ['assessments'] as const,
  detail: (jobId: string) => [...assessmentsKeys.all, 'detail', jobId] as const,
};

// Get assessment
export function useAssessment(jobId: string) {
  return useQuery({
    queryKey: assessmentsKeys.detail(jobId),
    queryFn: () => assessmentsApi.getAssessment(jobId),
    enabled: !!jobId,
    staleTime: 30000, // 30 seconds
  });
}

// Save assessment mutation
export function useSaveAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { title: string; sections: any[] } }) =>
      assessmentsApi.saveAssessment(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: assessmentsKeys.detail(jobId) });
      toast({
        title: 'Success',
        description: 'Assessment saved successfully',
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

// Submit assessment mutation
export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { candidateId: string; responses: any[] } }) =>
      assessmentsApi.submitAssessment(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentsKeys.all });
      toast({
        title: 'Success',
        description: 'Assessment submitted successfully',
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
