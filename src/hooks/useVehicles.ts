import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicle.service';
import type { VehicleCreateInput, VehicleUpdateInput } from '@/types/vehicle.types';
import { toast } from '@/components/ui/toast';

export function useVehicles() {
  return useQuery({ queryKey: ['vehicles'], queryFn: () => vehicleService.getVehicles() });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: VehicleCreateInput) => vehicleService.createVehicle(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); toast({ title: 'Vehicle Added', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to add vehicle.', variant: 'destructive' }); },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VehicleUpdateInput }) => vehicleService.updateVehicle(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); toast({ title: 'Vehicle Updated', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to update vehicle.', variant: 'destructive' }); },
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); toast({ title: 'Vehicle Deleted', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to delete vehicle.', variant: 'destructive' }); },
  });
}
