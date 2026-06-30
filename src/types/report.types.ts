export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
  route?: string;
  coalType?: string;
}

export interface DailyReport {
  date: string;
  totalDispatched: number;
  totalDelivered: number;
  totalQuantityMT: number;
  avgTransitHours: number;
}

export interface DelayedReport {
  tripId: string;
  vehicleNumber: string;
  sourceColliery: string;
  destination: string;
  expectedArrival: string;
  delayHours: number;
  status: string;
}

export interface VarianceReport {
  tripId: string;
  vehicleNumber: string;
  sourceWeight: number;
  destinationWeight: number;
  variancePercentage: number;
  varianceKG: number;
}

export interface UtilizationReport {
  vehicleNumber: string;
  totalTrips: number;
  totalQuantityMT: number;
  avgQuantityPerTrip: number;
  utilizationPercentage: number;
}

export interface RouteReport {
  route: string;
  totalTrips: number;
  avgTransitHours: number;
  delayedPercentage: number;
  totalQuantityMT: number;
}
