import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITrip extends Document {
  tripId: string;
  vehicleId: Types.ObjectId;
  driverName: string;
  sourceColliery: string;
  destination: string;
  coalType: string;
  authorizedQuantityMT: number;
  dispatchDate: Date;
  expectedArrival: Date;
  actualArrival?: Date;
  status: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    tripId: { type: String, required: true, unique: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driverName: { type: String, required: true },
    sourceColliery: { type: String, required: true },
    destination: { type: String, required: true },
    coalType: { 
      type: String, 
      required: true,
      enum: ['Grade-I', 'Grade-II', 'Grade-III', 'Washery-Grade-I', 'Washery-Grade-II', 'Slack', 'Steam']
    },
    authorizedQuantityMT: { type: Number, required: true },
    dispatchDate: { type: Date, required: true },
    expectedArrival: { type: Date, required: true },
    actualArrival: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ['Loading', 'InTransit', 'Delivered', 'Delayed', 'Flagged'],
      default: 'Loading'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

// Indexes for searching and filtering
TripSchema.index({ status: 1 });
TripSchema.index({ dispatchDate: 1 });
TripSchema.index({ vehicleId: 1 });

export default (mongoose.models.Trip as mongoose.Model<ITrip>) || mongoose.model<ITrip>('Trip', TripSchema);
