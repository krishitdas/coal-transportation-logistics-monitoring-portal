import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'AreaManager', 'DispatchOfficer', 'TransportOfficer', 'WeighbridgeOperator', 'Auditor']),
  active: z.boolean().default(true),
});

export const userUpdateSchema = userSchema.partial().extend({
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});
