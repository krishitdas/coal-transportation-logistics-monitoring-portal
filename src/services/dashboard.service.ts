import type { KPI, DispatchTrend, StatusDistribution, RouteUtilization } from '@/types/dashboard.types';
import api from './api';

const USE_MOCK = true;

const MOCK_KPIS: KPI[] = [
  { label: 'Total Dispatches', value: 1247, change: 12.5, changeType: 'increase', icon: 'truck', unit: 'trips' },
  { label: 'Coal Transported', value: 28450, change: 8.3, changeType: 'increase', icon: 'weight', unit: 'MT' },
  { label: 'Active Vehicles', value: 89, change: 3, changeType: 'increase', icon: 'fleet', unit: '' },
  { label: 'Avg Transit Time', value: 14.2, change: -2.1, changeType: 'decrease', icon: 'clock', unit: 'hrs' },
  { label: 'On-Time Delivery', value: 87.5, change: 4.2, changeType: 'increase', icon: 'check', unit: '%' },
  { label: 'Active Alerts', value: 12, change: -3, changeType: 'decrease', icon: 'alert', unit: '' },
];

const MOCK_TRENDS: DispatchTrend[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  const dispatched = Math.floor(Math.random() * 30) + 60;
  return {
    date: date.toISOString().split('T')[0],
    dispatched,
    delivered: dispatched - Math.floor(Math.random() * 10),
    delayed: Math.floor(Math.random() * 8),
  };
});

const MOCK_STATUS_DIST: StatusDistribution[] = [
  { status: 'Loading', count: 15, percentage: 12, color: '#0ea5e9' },
  { status: 'InTransit', count: 42, percentage: 34, color: '#2563eb' },
  { status: 'Delivered', count: 48, percentage: 38, color: '#22c55e' },
  { status: 'Delayed', count: 12, percentage: 10, color: '#f59e0b' },
  { status: 'Flagged', count: 8, percentage: 6, color: '#ef4444' },
];

const MOCK_ROUTE_UTIL: RouteUtilization[] = [
  { route: 'Rajrappa → NTPC Kahalgaon', trips: 156, avgQuantity: 24.5 },
  { route: 'Kathara → DVC Chandrapura', trips: 134, avgQuantity: 21.8 },
  { route: 'Dakra → SAIL Bokaro', trips: 128, avgQuantity: 22.3 },
  { route: 'Piparwar → NTPC Barh', trips: 112, avgQuantity: 26.1 },
  { route: 'Ashoka → TATA Steel', trips: 98, avgQuantity: 23.7 },
  { route: 'Magadh → Hindalco', trips: 87, avgQuantity: 25.4 },
  { route: 'Amrapali → NSPCL Bhilai', trips: 76, avgQuantity: 22.9 },
  { route: 'Kedla → DPL Durgapur', trips: 65, avgQuantity: 20.8 },
];

export const dashboardService = {
  async getKPIs(): Promise<KPI[]> {
    if (USE_MOCK) return MOCK_KPIS;
    const { data } = await api.get<KPI[]>('/dashboard/kpis');
    return data;
  },

  async getTrends(): Promise<DispatchTrend[]> {
    if (USE_MOCK) return MOCK_TRENDS;
    const { data } = await api.get<DispatchTrend[]>('/dashboard/trends');
    return data;
  },

  async getStatusDistribution(): Promise<StatusDistribution[]> {
    if (USE_MOCK) return MOCK_STATUS_DIST;
    const { data } = await api.get<StatusDistribution[]>('/dashboard/status');
    return data;
  },

  async getRouteUtilization(): Promise<RouteUtilization[]> {
    if (USE_MOCK) return MOCK_ROUTE_UTIL;
    const { data } = await api.get<RouteUtilization[]>('/dashboard/routes');
    return data;
  },
};
