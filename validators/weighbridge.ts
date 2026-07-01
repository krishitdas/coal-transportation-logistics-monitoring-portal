import { z } from 'zod';

export const weighbridgeSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  tareWeight: z.number().positive('Tare Weight must be positive'),
  grossWeight: z.number().positive('Gross Weight must be positive'),
  netWeight: z.number().positive('Net Weight must be positive'),
  destinationWeight: z.number().positive().optional(),
  variancePercentage: z.number().optional(),
  recordedBy: z.string().min(1, 'Recorded By is required'),
});

export const weighbridgeUpdateSchema = weighbridgeSchema.partial();
