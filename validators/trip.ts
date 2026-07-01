import { z } from 'zod';

export const tripSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  driverName: z.string().min(1, 'Driver Name is required'),
  sourceColliery: z.string().min(1, 'Source Colliery is required'),
  destination: z.string().min(1, 'Destination is required'),
  coalType: z.enum(['Grade-I', 'Grade-II', 'Grade-III', 'Washery-Grade-I', 'Washery-Grade-II', 'Slack', 'Steam']),
  authorizedQuantityMT: z.number().positive('Quantity must be positive'),
  dispatchDate: z.string().or(z.date()),
  expectedArrival: z.string().or(z.date()),
  status: z.enum(['Loading', 'InTransit', 'Delivered', 'Delayed', 'Flagged']).optional(),
});

export const tripUpdateSchema = tripSchema.partial();
