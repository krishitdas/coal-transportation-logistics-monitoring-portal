export enum AlertType {
  Delay = 'Delay',
  WeightVariance = 'WeightVariance',
  VehicleExpiry = 'VehicleExpiry',
  RouteDeviation = 'RouteDeviation',
}

export enum AlertSeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum AlertStatus {
  Active = 'Active',
  Acknowledged = 'Acknowledged',
  Resolved = 'Resolved',
}

export interface Alert {
  _id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  relatedTripId?: string;
  relatedVehicleId?: string;
  createdAt: string;
  updatedAt: string;
}
