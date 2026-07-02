import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWeighbridgeEntry extends Document {
  tripId: Types.ObjectId;
  tareWeight: number;
  grossWeight: number;
  netWeight: number;
  destinationWeight?: number;
  variancePercentage?: number;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeighbridgeEntrySchema: Schema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
    tareWeight: { type: Number, required: true },
    grossWeight: { type: Number, required: true },
    netWeight: { type: Number, required: true },
    destinationWeight: { type: Number },
    variancePercentage: { type: Number },
    recordedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.WeighbridgeEntry as mongoose.Model<IWeighbridgeEntry>) || mongoose.model<IWeighbridgeEntry>('WeighbridgeEntry', WeighbridgeEntrySchema);
