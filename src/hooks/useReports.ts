import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import type { ReportFilters } from '@/types/report.types';

export function useDailyReport(filters?: ReportFilters) {
  return useQuery({ queryKey: ['reports', 'daily', filters], queryFn: () => reportService.getDailyReport(filters) });
}
export function useDelayedReport(filters?: ReportFilters) {
  return useQuery({ queryKey: ['reports', 'delayed', filters], queryFn: () => reportService.getDelayedReport(filters) });
}
export function useVarianceReport(filters?: ReportFilters) {
  return useQuery({ queryKey: ['reports', 'variance', filters], queryFn: () => reportService.getVarianceReport(filters) });
}
export function useUtilizationReport(filters?: ReportFilters) {
  return useQuery({ queryKey: ['reports', 'utilization', filters], queryFn: () => reportService.getUtilizationReport(filters) });
}
export function useRouteReport(filters?: ReportFilters) {
  return useQuery({ queryKey: ['reports', 'routes', filters], queryFn: () => reportService.getRouteReport(filters) });
}
