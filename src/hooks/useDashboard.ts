import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useKPIs() {
  return useQuery({ queryKey: ['dashboard', 'kpis'], queryFn: () => dashboardService.getKPIs() });
}

export function useTrends() {
  return useQuery({ queryKey: ['dashboard', 'trends'], queryFn: () => dashboardService.getTrends() });
}

export function useStatusDistribution() {
  return useQuery({ queryKey: ['dashboard', 'status-distribution'], queryFn: () => dashboardService.getStatusDistribution() });
}

export function useRouteUtilization() {
  return useQuery({ queryKey: ['dashboard', 'route-utilization'], queryFn: () => dashboardService.getRouteUtilization() });
}
