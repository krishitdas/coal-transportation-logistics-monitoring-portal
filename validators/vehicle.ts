import { z } from 'zod';

export const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle Number is required'),
  transporterName: z.string().min(1, 'Transporter Name is required'),
  capacityMT: z.number().positive('Capacity must be positive'),
  insuranceExpiry: z.string().or(z.date()),
  fitnessExpiry: z.string().or(z.date()),
  pucExpiry: z.string().or(z.date()),
  active: z.boolean().optional(),
});

export const vehicleUpdateSchema = vehicleSchema.partial();
