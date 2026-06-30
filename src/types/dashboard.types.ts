export interface KPI {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit?: string;
  icon: string;
}

export interface DispatchTrend {
  date: string;
  dispatched: number;
  delivered: number;
  delayed: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RouteUtilization {
  route: string;
  trips: number;
  avgQuantity: number;
}

export interface DashboardData {
  kpis: KPI[];
  trends: DispatchTrend[];
  statusDistribution: StatusDistribution[];
  routeUtilization: RouteUtilization[];
}
