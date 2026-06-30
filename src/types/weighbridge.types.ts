export interface WeighbridgeEntry {
  _id: string;
  tripId: string;
  trip?: {
    _id: string;
    tripId: string;
    vehicleId: string;
    vehicle?: {
      vehicleNumber: string;
    };
    sourceColliery: string;
    destination: string;
    authorizedQuantityMT: number;
  };
  tareWeight: number;
  grossWeight: number;
  netWeight: number;
  destinationWeight: number;
  variancePercentage: number;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeighbridgeCreateInput {
  tripId: string;
  tareWeight: number;
  grossWeight: number;
  destinationWeight?: number;
}

export interface WeighbridgeUpdateInput {
  destinationWeight?: number;
  tareWeight?: number;
  grossWeight?: number;
}
