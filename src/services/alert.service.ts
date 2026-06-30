import type { Alert } from '@/types/alert.types';
import { AlertType, AlertSeverity, AlertStatus } from '@/types/alert.types';
import api from './api';

const MOCK_ALERTS: Alert[] = [
  { _id: 'a1', type: AlertType.Delay, message: 'Trip CCL-2025-00004 delayed by 6 hours - NTPC Barh route', severity: AlertSeverity.High, status: AlertStatus.Active, relatedTripId: '4', createdAt: '2025-06-28T02:00:00Z', updatedAt: '2025-06-28T02:00:00Z' },
  { _id: 'a2', type: AlertType.WeightVariance, message: 'Weight variance of -4.33% detected on trip CCL-2025-00004', severity: AlertSeverity.Critical, status: AlertStatus.Active, relatedTripId: '4', createdAt: '2025-06-28T02:30:00Z', updatedAt: '2025-06-28T02:30:00Z' },
  { _id: 'a3', type: AlertType.VehicleExpiry, message: 'Vehicle JH-04-GH-3456 insurance expires on Jul 01, 2025', severity: AlertSeverity.High, status: AlertStatus.Active, relatedVehicleId: 'v4', createdAt: '2025-06-25T00:00:00Z', updatedAt: '2025-06-25T00:00:00Z' },
  { _id: 'a4', type: AlertType.VehicleExpiry, message: 'Vehicle JH-09-QR-4567 fitness certificate expired', severity: AlertSeverity.Critical, status: AlertStatus.Acknowledged, relatedVehicleId: 'v9', createdAt: '2025-06-30T00:00:00Z', updatedAt: '2025-06-30T08:00:00Z' },
  { _id: 'a5', type: AlertType.RouteDeviation, message: 'Trip CCL-2025-00006 flagged for possible route deviation', severity: AlertSeverity.Medium, status: AlertStatus.Active, relatedTripId: '6', createdAt: '2025-06-29T15:00:00Z', updatedAt: '2025-06-29T15:00:00Z' },
  { _id: 'a6', type: AlertType.Delay, message: 'Trip CCL-2025-00008 may exceed expected arrival time', severity: AlertSeverity.Low, status: AlertStatus.Active, relatedTripId: '8', createdAt: '2025-06-29T20:00:00Z', updatedAt: '2025-06-29T20:00:00Z' },
  { _id: 'a7', type: AlertType.WeightVariance, message: 'Weight variance of -2.64% on trip CCL-2025-00007', severity: AlertSeverity.Medium, status: AlertStatus.Resolved, relatedTripId: '7', createdAt: '2025-06-29T08:30:00Z', updatedAt: '2025-06-29T10:00:00Z' },
  { _id: 'a8', type: AlertType.VehicleExpiry, message: 'Vehicle JH-06-KL-2345 PUC expires on Jul 20, 2025', severity: AlertSeverity.Low, status: AlertStatus.Active, relatedVehicleId: 'v6', createdAt: '2025-06-28T00:00:00Z', updatedAt: '2025-06-28T00:00:00Z' },
];

const USE_MOCK = true;

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    if (USE_MOCK) return MOCK_ALERTS;
    const { data } = await api.get<Alert[]>('/alerts');
    return data;
  },

  async acknowledgeAlert(id: string): Promise<Alert> {
    if (USE_MOCK) {
      const idx = MOCK_ALERTS.findIndex(a => a._id === id);
      if (idx === -1) throw new Error('Alert not found');
      MOCK_ALERTS[idx] = { ...MOCK_ALERTS[idx], status: AlertStatus.Acknowledged, updatedAt: new Date().toISOString() };
      return MOCK_ALERTS[idx];
    }
    const { data } = await api.put<Alert>(`/alerts/${id}/read`);
    return data;
  },
};
