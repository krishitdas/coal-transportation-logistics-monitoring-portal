export enum UserRole {
  Admin = 'Admin',
  AreaManager = 'AreaManager',
  DispatchOfficer = 'DispatchOfficer',
  TransportOfficer = 'TransportOfficer',
  WeighbridgeOperator = 'WeighbridgeOperator',
  Auditor = 'Auditor',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
