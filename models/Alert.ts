import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAlert extends Document {
  type: string;
  message: string;
  severity: string;
  status: string;
  relatedTripId?: Types.ObjectId;
  relatedVehicleId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema: Schema = new Schema(
  {
    type: { 
      type: String, 
      required: true,
      enum: ['Delay', 'WeightVariance', 'VehicleExpiry', 'RouteDeviation']
    },
    message: { type: String, required: true },
    severity: { 
      type: String, 
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    status: { 
      type: String, 
      required: true,
      enum: ['Active', 'Acknowledged', 'Resolved'],
      default: 'Active'
    },
    relatedTripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    relatedVehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  },
  { timestamps: true }
);

AlertSchema.index({ status: 1 });
AlertSchema.index({ severity: 1 });

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
