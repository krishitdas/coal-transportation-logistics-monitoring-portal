import type { RouteCheckpoint, CheckpointCreateInput } from '@/types/checkpoint.types';
import api from './api';

const MOCK_CHECKPOINTS: RouteCheckpoint[] = [
  { _id: 'c1', tripId: '2', checkpointName: 'Source Gate Exit', timestamp: '2025-06-28T07:15:00Z', remarks: 'Cleared with all documents', createdAt: '2025-06-28T07:15:00Z' },
  { _id: 'c2', tripId: '2', checkpointName: 'NH-33 Junction', timestamp: '2025-06-28T08:30:00Z', remarks: 'On schedule', createdAt: '2025-06-28T08:30:00Z' },
  { _id: 'c3', tripId: '2', checkpointName: 'Ramgarh Toll Plaza', timestamp: '2025-06-28T09:45:00Z', remarks: 'Toll paid, minor delay', createdAt: '2025-06-28T09:45:00Z' },
  { _id: 'c4', tripId: '5', checkpointName: 'Source Gate Exit', timestamp: '2025-06-29T08:20:00Z', remarks: 'Departed on time', createdAt: '2025-06-29T08:20:00Z' },
  { _id: 'c5', tripId: '5', checkpointName: 'NH-33 Junction', timestamp: '2025-06-29T09:40:00Z', remarks: 'Heavy traffic reported', createdAt: '2025-06-29T09:40:00Z' },
  { _id: 'c6', tripId: '8', checkpointName: 'Source Gate Exit', timestamp: '2025-06-29T07:20:00Z', remarks: 'All clear', createdAt: '2025-06-29T07:20:00Z' },
  { _id: 'c7', tripId: '8', checkpointName: 'Hazaribagh Bypass', timestamp: '2025-06-29T10:00:00Z', remarks: 'Bypassed successfully', createdAt: '2025-06-29T10:00:00Z' },
  { _id: 'c8', tripId: '8', checkpointName: 'Koderma Check Post', timestamp: '2025-06-29T12:30:00Z', remarks: 'Document verification done', createdAt: '2025-06-29T12:30:00Z' },
  { _id: 'c9', tripId: '4', checkpointName: 'Source Gate Exit', timestamp: '2025-06-27T06:15:00Z', remarks: 'Departed', createdAt: '2025-06-27T06:15:00Z' },
  { _id: 'c10', tripId: '4', checkpointName: 'State Border Checkpoint', timestamp: '2025-06-27T14:00:00Z', remarks: 'Delayed due to roadwork', createdAt: '2025-06-27T14:00:00Z' },
];

const USE_MOCK = true;

export const checkpointService = {
  async getCheckpoints(tripId: string): Promise<RouteCheckpoint[]> {
    if (USE_MOCK) return MOCK_CHECKPOINTS.filter(c => c.tripId === tripId);
    const { data } = await api.get<RouteCheckpoint[]>(`/checkpoints/${tripId}`);
    return data;
  },

  async createCheckpoint(input: CheckpointCreateInput): Promise<RouteCheckpoint> {
    if (USE_MOCK) {
      const cp: RouteCheckpoint = { _id: `c${MOCK_CHECKPOINTS.length + 1}`, ...input, remarks: input.remarks || '', createdAt: new Date().toISOString() };
      MOCK_CHECKPOINTS.push(cp);
      return cp;
    }
    const { data } = await api.post<RouteCheckpoint>('/checkpoints', input);
    return data;
  },
};
