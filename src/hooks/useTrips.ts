import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';
import type { TripFilters, TripCreateInput, TripUpdateInput } from '@/types/trip.types';
import { toast } from '@/components/ui/toast';

export function useTrips(filters?: TripFilters) {
  return useQuery({ queryKey: ['trips', filters], queryFn: () => tripService.getTrips(filters) });
}

export function useTrip(id: string) {
  return useQuery({ queryKey: ['trips', id], queryFn: () => tripService.getTrip(id), enabled: !!id });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TripCreateInput) => tripService.createTrip(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trips'] }); toast({ title: 'Trip Created', description: 'New dispatch has been created successfully.', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to create trip.', variant: 'destructive' }); },
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TripUpdateInput }) => tripService.updateTrip(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trips'] }); toast({ title: 'Trip Updated', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to update trip.', variant: 'destructive' }); },
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripService.deleteTrip(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['trips'] }); toast({ title: 'Trip Deleted', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to delete trip.', variant: 'destructive' }); },
  });
}
