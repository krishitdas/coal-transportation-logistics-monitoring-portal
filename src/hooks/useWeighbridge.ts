import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weighbridgeService } from '@/services/weighbridge.service';
import type { WeighbridgeCreateInput, WeighbridgeUpdateInput } from '@/types/weighbridge.types';
import { toast } from '@/components/ui/toast';

export function useWeighbridgeEntries() {
  return useQuery({ queryKey: ['weighbridge'], queryFn: () => weighbridgeService.getEntries() });
}

export function useCreateWeighbridgeEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: WeighbridgeCreateInput) => weighbridgeService.createEntry(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['weighbridge'] }); toast({ title: 'Entry Recorded', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to record entry.', variant: 'destructive' }); },
  });
}

export function useUpdateWeighbridgeEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WeighbridgeUpdateInput }) => weighbridgeService.updateEntry(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['weighbridge'] }); toast({ title: 'Entry Updated', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to update entry.', variant: 'destructive' }); },
  });
}
