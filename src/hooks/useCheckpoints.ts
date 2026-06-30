import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkpointService } from '@/services/checkpoint.service';
import type { CheckpointCreateInput } from '@/types/checkpoint.types';
import { toast } from '@/components/ui/toast';

export function useCheckpoints(tripId: string) {
  return useQuery({ queryKey: ['checkpoints', tripId], queryFn: () => checkpointService.getCheckpoints(tripId), enabled: !!tripId });
}

export function useCreateCheckpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CheckpointCreateInput) => checkpointService.createCheckpoint(input),
    onSuccess: (_, variables) => { qc.invalidateQueries({ queryKey: ['checkpoints', variables.tripId] }); toast({ title: 'Checkpoint Logged', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to log checkpoint.', variant: 'destructive' }); },
  });
}
