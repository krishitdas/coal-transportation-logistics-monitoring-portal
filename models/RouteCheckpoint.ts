import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRouteCheckpoint extends Document {
  tripId: Types.ObjectId;
  checkpointName: string;
  timestamp: Date;
  remarks?: string;
  createdAt: Date;
}

const RouteCheckpointSchema: Schema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    checkpointName: { type: String, required: true },
    timestamp: { type: Date, required: true },
    remarks: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

RouteCheckpointSchema.index({ tripId: 1 });
RouteCheckpointSchema.index({ timestamp: 1 });

export default (mongoose.models.RouteCheckpoint as mongoose.Model<IRouteCheckpoint>) || mongoose.model<IRouteCheckpoint>('RouteCheckpoint', RouteCheckpointSchema);
