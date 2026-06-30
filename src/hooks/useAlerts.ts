import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/alert.service';
import { toast } from '@/components/ui/toast';

export function useAlerts() {
  return useQuery({ queryKey: ['alerts'], queryFn: () => alertService.getAlerts() });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertService.acknowledgeAlert(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alerts'] }); toast({ title: 'Alert Acknowledged', variant: 'success' }); },
  });
}
