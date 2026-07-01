import { z } from 'zod';

export const alertSchema = z.object({
  type: z.enum(['Delay', 'WeightVariance', 'VehicleExpiry', 'RouteDeviation']),
  message: z.string().min(1, 'Message is required'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Active', 'Acknowledged', 'Resolved']).default('Active'),
  relatedTripId: z.string().optional(),
  relatedVehicleId: z.string().optional(),
});

export const alertUpdateSchema = alertSchema.partial();
