import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../src/types/auth.types.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      required: true,
      enum: ['Admin', 'AreaManager', 'DispatchOfficer', 'TransportOfficer', 'WeighbridgeOperator', 'Auditor']
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
