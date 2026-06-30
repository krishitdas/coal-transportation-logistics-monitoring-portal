export enum TripStatus {
  Loading = 'Loading',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Delayed = 'Delayed',
  Flagged = 'Flagged',
}

export enum CoalType {
  GradeI = 'Grade-I',
  GradeII = 'Grade-II',
  GradeIII = 'Grade-III',
  WasheryGradeI = 'Washery-Grade-I',
  WasheryGradeII = 'Washery-Grade-II',
  Slack = 'Slack',
  Steam = 'Steam',
}

export interface Trip {
  _id: string;
  tripId: string;
  vehicleId: string;
  vehicle?: {
    _id: string;
    vehicleNumber: string;
    transporterName: string;
  };
  driverName: string;
  sourceColliery: string;
  destination: string;
  coalType: CoalType;
  authorizedQuantityMT: number;
  dispatchDate: string;
  expectedArrival: string;
  actualArrival?: string;
  status: TripStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripCreateInput {
  vehicleId: string;
  driverName: string;
  sourceColliery: string;
  destination: string;
  coalType: CoalType;
  authorizedQuantityMT: number;
  dispatchDate: string;
  expectedArrival: string;
}

export interface TripUpdateInput extends Partial<TripCreateInput> {
  status?: TripStatus;
  actualArrival?: string;
}

export interface TripFilters {
  status?: TripStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
