import type { Vehicle, VehicleCreateInput, VehicleUpdateInput } from '@/types/vehicle.types';
import api from './api';

const MOCK_VEHICLES: Vehicle[] = [
  { _id: 'v1', vehicleNumber: 'JH-01-AB-1234', transporterName: 'Jharkhand Transport Co.', capacityMT: 25, insuranceExpiry: '2026-03-15T00:00:00Z', fitnessExpiry: '2026-06-20T00:00:00Z', pucExpiry: '2025-09-10T00:00:00Z', active: true, createdAt: '2024-01-01', updatedAt: '2025-01-01' },
  { _id: 'v2', vehicleNumber: 'JH-02-CD-5678', transporterName: 'Eastern Carriers Pvt. Ltd.', capacityMT: 20, insuranceExpiry: '2026-01-10T00:00:00Z', fitnessExpiry: '2025-12-31T00:00:00Z', pucExpiry: '2025-08-15T00:00:00Z', active: true, createdAt: '2024-02-01', updatedAt: '2025-02-01' },
  { _id: 'v3', vehicleNumber: 'JH-03-EF-9012', transporterName: 'CCL Fleet Services', capacityMT: 22, insuranceExpiry: '2026-05-20T00:00:00Z', fitnessExpiry: '2026-04-10T00:00:00Z', pucExpiry: '2025-11-30T00:00:00Z', active: true, createdAt: '2024-03-01', updatedAt: '2025-03-01' },
  { _id: 'v4', vehicleNumber: 'JH-04-GH-3456', transporterName: 'Bihar Roadways Ltd.', capacityMT: 28, insuranceExpiry: '2025-07-01T00:00:00Z', fitnessExpiry: '2025-07-15T00:00:00Z', pucExpiry: '2025-07-05T00:00:00Z', active: true, createdAt: '2024-04-01', updatedAt: '2025-04-01' },
  { _id: 'v5', vehicleNumber: 'JH-05-IJ-7890', transporterName: 'Ranchi Freight Corp.', capacityMT: 24, insuranceExpiry: '2026-08-10T00:00:00Z', fitnessExpiry: '2026-07-20T00:00:00Z', pucExpiry: '2026-01-15T00:00:00Z', active: true, createdAt: '2024-05-01', updatedAt: '2025-05-01' },
  { _id: 'v6', vehicleNumber: 'JH-06-KL-2345', transporterName: 'Dhanbad Logistics', capacityMT: 26, insuranceExpiry: '2025-08-05T00:00:00Z', fitnessExpiry: '2025-09-01T00:00:00Z', pucExpiry: '2025-07-20T00:00:00Z', active: true, createdAt: '2024-06-01', updatedAt: '2025-06-01' },
  { _id: 'v7', vehicleNumber: 'JH-07-MN-6789', transporterName: 'Coal Movers India', capacityMT: 23, insuranceExpiry: '2026-02-28T00:00:00Z', fitnessExpiry: '2026-01-15T00:00:00Z', pucExpiry: '2025-10-30T00:00:00Z', active: true, createdAt: '2024-07-01', updatedAt: '2025-07-01' },
  { _id: 'v8', vehicleNumber: 'JH-08-OP-0123', transporterName: 'National Bulk Carriers', capacityMT: 21, insuranceExpiry: '2026-04-15T00:00:00Z', fitnessExpiry: '2026-03-20T00:00:00Z', pucExpiry: '2025-12-10T00:00:00Z', active: true, createdAt: '2024-08-01', updatedAt: '2025-08-01' },
  { _id: 'v9', vehicleNumber: 'JH-09-QR-4567', transporterName: 'Jharkhand Transport Co.', capacityMT: 30, insuranceExpiry: '2025-06-15T00:00:00Z', fitnessExpiry: '2025-06-30T00:00:00Z', pucExpiry: '2025-06-20T00:00:00Z', active: false, createdAt: '2024-09-01', updatedAt: '2025-09-01' },
  { _id: 'v10', vehicleNumber: 'JH-10-ST-8901', transporterName: 'Eastern Carriers Pvt. Ltd.', capacityMT: 27, insuranceExpiry: '2026-09-10T00:00:00Z', fitnessExpiry: '2026-08-20T00:00:00Z', pucExpiry: '2026-02-15T00:00:00Z', active: true, createdAt: '2024-10-01', updatedAt: '2025-10-01' },
];

const USE_MOCK = true;

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    if (USE_MOCK) return MOCK_VEHICLES;
    const { data } = await api.get<Vehicle[]>('/vehicles');
    return data;
  },

  async getVehicle(id: string): Promise<Vehicle> {
    if (USE_MOCK) {
      const v = MOCK_VEHICLES.find(v => v._id === id);
      if (!v) throw new Error('Vehicle not found');
      return v;
    }
    const { data } = await api.get<Vehicle>(`/vehicles/${id}`);
    return data;
  },

  async createVehicle(input: VehicleCreateInput): Promise<Vehicle> {
    if (USE_MOCK) {
      const newV: Vehicle = { _id: `v${MOCK_VEHICLES.length + 1}`, ...input, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_VEHICLES.push(newV);
      return newV;
    }
    const { data } = await api.post<Vehicle>('/vehicles', input);
    return data;
  },

  async updateVehicle(id: string, input: VehicleUpdateInput): Promise<Vehicle> {
    if (USE_MOCK) {
      const idx = MOCK_VEHICLES.findIndex(v => v._id === id);
      if (idx === -1) throw new Error('Vehicle not found');
      MOCK_VEHICLES[idx] = { ...MOCK_VEHICLES[idx], ...input, updatedAt: new Date().toISOString() };
      return MOCK_VEHICLES[idx];
    }
    const { data } = await api.put<Vehicle>(`/vehicles/${id}`, input);
    return data;
  },

  async deleteVehicle(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_VEHICLES.findIndex(v => v._id === id);
      if (idx !== -1) MOCK_VEHICLES.splice(idx, 1);
      return;
    }
    await api.delete(`/vehicles/${id}`);
  },
};
