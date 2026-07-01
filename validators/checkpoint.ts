import { z } from 'zod';

export const checkpointSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  checkpointName: z.string().min(1, 'Checkpoint Name is required'),
  timestamp: z.string().or(z.date()),
  remarks: z.string().optional(),
});
