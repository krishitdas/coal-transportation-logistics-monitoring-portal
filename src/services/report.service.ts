import type { ReportFilters, DailyReport, DelayedReport, VarianceReport, UtilizationReport, RouteReport } from '@/types/report.types';
import api from './api';

const USE_MOCK = true;

const MOCK_DAILY: DailyReport[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  const dispatched = Math.floor(Math.random() * 40) + 50;
  return { date: date.toISOString().split('T')[0], totalDispatched: dispatched, totalDelivered: dispatched - Math.floor(Math.random() * 10), totalQuantityMT: dispatched * (Math.random() * 5 + 20), avgTransitHours: Math.random() * 8 + 10 };
});

const MOCK_DELAYED: DelayedReport[] = [
  { tripId: 'CCL-2025-00004', vehicleNumber: 'JH-04-GH-3456', sourceColliery: 'Piparwar Colliery', destination: 'NTPC Barh', expectedArrival: '2025-06-27T20:00:00Z', delayHours: 6, status: 'Delayed' },
  { tripId: 'CCL-2025-00006', vehicleNumber: 'JH-06-KL-2345', sourceColliery: 'Magadh Colliery', destination: 'Hindalco Renukoot', expectedArrival: '2025-06-30T06:00:00Z', delayHours: 3, status: 'Flagged' },
];

const MOCK_VARIANCE: VarianceReport[] = [
  { tripId: 'CCL-2025-00004', vehicleNumber: 'JH-04-GH-3456', sourceWeight: 27.7, destinationWeight: 26.5, variancePercentage: -4.33, varianceKG: -1200 },
  { tripId: 'CCL-2025-00007', vehicleNumber: 'JH-07-MN-6789', sourceWeight: 22.7, destinationWeight: 22.1, variancePercentage: -2.64, varianceKG: -600 },
  { tripId: 'CCL-2025-00001', vehicleNumber: 'JH-01-AB-1234', sourceWeight: 24.7, destinationWeight: 24.3, variancePercentage: -1.62, varianceKG: -400 },
  { tripId: 'CCL-2025-00010', vehicleNumber: 'JH-03-EF-9012', sourceWeight: 26.6, destinationWeight: 25.9, variancePercentage: -2.63, varianceKG: -700 },
];

const MOCK_UTILIZATION: UtilizationReport[] = [
  { vehicleNumber: 'JH-01-AB-1234', totalTrips: 42, totalQuantityMT: 1050, avgQuantityPerTrip: 25, utilizationPercentage: 92 },
  { vehicleNumber: 'JH-02-CD-5678', totalTrips: 38, totalQuantityMT: 760, avgQuantityPerTrip: 20, utilizationPercentage: 85 },
  { vehicleNumber: 'JH-03-EF-9012', totalTrips: 45, totalQuantityMT: 990, avgQuantityPerTrip: 22, utilizationPercentage: 95 },
  { vehicleNumber: 'JH-04-GH-3456', totalTrips: 35, totalQuantityMT: 980, avgQuantityPerTrip: 28, utilizationPercentage: 78 },
  { vehicleNumber: 'JH-05-IJ-7890', totalTrips: 40, totalQuantityMT: 960, avgQuantityPerTrip: 24, utilizationPercentage: 88 },
  { vehicleNumber: 'JH-07-MN-6789', totalTrips: 33, totalQuantityMT: 759, avgQuantityPerTrip: 23, utilizationPercentage: 73 },
  { vehicleNumber: 'JH-08-OP-0123', totalTrips: 30, totalQuantityMT: 630, avgQuantityPerTrip: 21, utilizationPercentage: 67 },
  { vehicleNumber: 'JH-10-ST-8901', totalTrips: 28, totalQuantityMT: 756, avgQuantityPerTrip: 27, utilizationPercentage: 62 },
];

const MOCK_ROUTES: RouteReport[] = [
  { route: 'Rajrappa → NTPC Kahalgaon', totalTrips: 156, avgTransitHours: 12.5, delayedPercentage: 8.3, totalQuantityMT: 3822 },
  { route: 'Kathara → DVC Chandrapura', totalTrips: 134, avgTransitHours: 7.2, delayedPercentage: 5.2, totalQuantityMT: 2921 },
  { route: 'Dakra → SAIL Bokaro', totalTrips: 128, avgTransitHours: 6.5, delayedPercentage: 4.1, totalQuantityMT: 2854 },
  { route: 'Piparwar → NTPC Barh', totalTrips: 112, avgTransitHours: 14.8, delayedPercentage: 12.5, totalQuantityMT: 2923 },
  { route: 'Ashoka → TATA Steel Jamshedpur', totalTrips: 98, avgTransitHours: 11.3, delayedPercentage: 9.2, totalQuantityMT: 2323 },
  { route: 'Magadh → Hindalco Renukoot', totalTrips: 87, avgTransitHours: 22.4, delayedPercentage: 15.1, totalQuantityMT: 2210 },
];

export const reportService = {
  async getDailyReport(_filters?: ReportFilters): Promise<DailyReport[]> {
    if (USE_MOCK) return MOCK_DAILY;
    const { data } = await api.get<DailyReport[]>('/reports/daily', { params: _filters });
    return data;
  },
  async getDelayedReport(_filters?: ReportFilters): Promise<DelayedReport[]> {
    if (USE_MOCK) return MOCK_DELAYED;
    const { data } = await api.get<DelayedReport[]>('/reports/delayed', { params: _filters });
    return data;
  },
  async getVarianceReport(_filters?: ReportFilters): Promise<VarianceReport[]> {
    if (USE_MOCK) return MOCK_VARIANCE;
    const { data } = await api.get<VarianceReport[]>('/reports/variance', { params: _filters });
    return data;
  },
  async getUtilizationReport(_filters?: ReportFilters): Promise<UtilizationReport[]> {
    if (USE_MOCK) return MOCK_UTILIZATION;
    const { data } = await api.get<UtilizationReport[]>('/reports/utilization', { params: _filters });
    return data;
  },
  async getRouteReport(_filters?: ReportFilters): Promise<RouteReport[]> {
    if (USE_MOCK) return MOCK_ROUTES;
    const { data } = await api.get<RouteReport[]>('/reports/routes', { params: _filters });
    return data;
  },
};
