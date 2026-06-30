export interface RouteCheckpoint {
  _id: string;
  tripId: string;
  checkpointName: string;
  timestamp: string;
  remarks: string;
  createdAt: string;
}

export interface CheckpointCreateInput {
  tripId: string;
  checkpointName: string;
  timestamp: string;
  remarks?: string;
}
