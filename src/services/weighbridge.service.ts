import type { WeighbridgeEntry, WeighbridgeCreateInput, WeighbridgeUpdateInput } from '@/types/weighbridge.types';
import api from './api';

const MOCK_WB_ENTRIES: WeighbridgeEntry[] = [
  { _id: 'w1', tripId: '1', trip: { _id: '1', tripId: 'CCL-2025-00001', vehicleId: 'v1', vehicle: { vehicleNumber: 'JH-01-AB-1234' }, sourceColliery: 'Rajrappa Colliery', destination: 'NTPC Kahalgaon', authorizedQuantityMT: 25 }, tareWeight: 12.5, grossWeight: 37.2, netWeight: 24.7, destinationWeight: 24.3, variancePercentage: -1.62, recordedBy: 'Priya Verma', createdAt: '2025-06-28T06:30:00Z', updatedAt: '2025-06-28T17:45:00Z' },
  { _id: 'w2', tripId: '7', trip: { _id: '7', tripId: 'CCL-2025-00007', vehicleId: 'v7', vehicle: { vehicleNumber: 'JH-07-MN-6789' }, sourceColliery: 'Amrapali Colliery', destination: 'NSPCL Bhilai', authorizedQuantityMT: 23 }, tareWeight: 11.8, grossWeight: 34.5, netWeight: 22.7, destinationWeight: 22.1, variancePercentage: -2.64, recordedBy: 'Priya Verma', createdAt: '2025-06-28T09:15:00Z', updatedAt: '2025-06-29T08:30:00Z' },
  { _id: 'w3', tripId: '10', trip: { _id: '10', tripId: 'CCL-2025-00010', vehicleId: 'v3', vehicle: { vehicleNumber: 'JH-03-EF-9012' }, sourceColliery: 'North Urimari Colliery', destination: 'Adani Power Tiroda', authorizedQuantityMT: 27 }, tareWeight: 13.2, grossWeight: 39.8, netWeight: 26.6, destinationWeight: 25.9, variancePercentage: -2.63, recordedBy: 'Priya Verma', createdAt: '2025-06-26T05:30:00Z', updatedAt: '2025-06-27T04:30:00Z' },
  { _id: 'w4', tripId: '4', trip: { _id: '4', tripId: 'CCL-2025-00004', vehicleId: 'v4', vehicle: { vehicleNumber: 'JH-04-GH-3456' }, sourceColliery: 'Piparwar Colliery', destination: 'NTPC Barh', authorizedQuantityMT: 28 }, tareWeight: 14.1, grossWeight: 41.8, netWeight: 27.7, destinationWeight: 26.5, variancePercentage: -4.33, recordedBy: 'Priya Verma', createdAt: '2025-06-27T06:15:00Z', updatedAt: '2025-06-28T02:30:00Z' },
  { _id: 'w5', tripId: '2', trip: { _id: '2', tripId: 'CCL-2025-00002', vehicleId: 'v2', vehicle: { vehicleNumber: 'JH-02-CD-5678' }, sourceColliery: 'Kathara Colliery', destination: 'DVC Chandrapura', authorizedQuantityMT: 20 }, tareWeight: 10.5, grossWeight: 30.2, netWeight: 19.7, destinationWeight: 0, variancePercentage: 0, recordedBy: 'Priya Verma', createdAt: '2025-06-28T07:10:00Z', updatedAt: '2025-06-28T07:10:00Z' },
];

const USE_MOCK = true;

export const weighbridgeService = {
  async getEntries(): Promise<WeighbridgeEntry[]> {
    if (USE_MOCK) return MOCK_WB_ENTRIES;
    const { data } = await api.get<WeighbridgeEntry[]>('/weighbridge');
    return data;
  },

  async createEntry(input: WeighbridgeCreateInput): Promise<WeighbridgeEntry> {
    if (USE_MOCK) {
      const netWeight = input.grossWeight - input.tareWeight;
      const entry: WeighbridgeEntry = {
        _id: `w${MOCK_WB_ENTRIES.length + 1}`, tripId: input.tripId, tareWeight: input.tareWeight, grossWeight: input.grossWeight, netWeight,
        destinationWeight: input.destinationWeight || 0,
        variancePercentage: input.destinationWeight ? ((input.destinationWeight - netWeight) / netWeight) * 100 : 0,
        recordedBy: 'Current User', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      MOCK_WB_ENTRIES.push(entry);
      return entry;
    }
    const { data } = await api.post<WeighbridgeEntry>('/weighbridge', input);
    return data;
  },

  async updateEntry(id: string, input: WeighbridgeUpdateInput): Promise<WeighbridgeEntry> {
    if (USE_MOCK) {
      const idx = MOCK_WB_ENTRIES.findIndex(w => w._id === id);
      if (idx === -1) throw new Error('Entry not found');
      const entry = MOCK_WB_ENTRIES[idx];
      const tare = input.tareWeight ?? entry.tareWeight;
      const gross = input.grossWeight ?? entry.grossWeight;
      const net = gross - tare;
      const dest = input.destinationWeight ?? entry.destinationWeight;
      MOCK_WB_ENTRIES[idx] = { ...entry, tareWeight: tare, grossWeight: gross, netWeight: net, destinationWeight: dest, variancePercentage: dest ? ((dest - net) / net) * 100 : 0, updatedAt: new Date().toISOString() };
      return MOCK_WB_ENTRIES[idx];
    }
    const { data } = await api.put<WeighbridgeEntry>(`/weighbridge/${id}`, input);
    return data;
  },
};
