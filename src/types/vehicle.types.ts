export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  transporterName: string;
  capacityMT: number;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pucExpiry: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCreateInput {
  vehicleNumber: string;
  transporterName: string;
  capacityMT: number;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pucExpiry: string;
}

export interface VehicleUpdateInput extends Partial<VehicleCreateInput> {
  active?: boolean;
}
