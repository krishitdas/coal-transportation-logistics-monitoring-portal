import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  vehicleNumber: string;
  transporterName: string;
  capacityMT: number;
  insuranceExpiry: Date;
  fitnessExpiry: Date;
  pucExpiry: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema: Schema = new Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    transporterName: { type: String, required: true },
    capacityMT: { type: Number, required: true },
    insuranceExpiry: { type: Date, required: true },
    fitnessExpiry: { type: Date, required: true },
    pucExpiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
