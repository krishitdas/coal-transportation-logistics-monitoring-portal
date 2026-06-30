import type { LoginCredentials, AuthResponse, User } from '@/types/auth.types';
import { UserRole } from '@/types/auth.types';
import api from './api';

// Demo users for local development without backend
const DEMO_USERS: (User & { password: string })[] = [
  { _id: '1', name: 'Rajesh Kumar', email: 'admin@ccl.gov.in', password: 'admin123', role: UserRole.Admin, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '2', name: 'Suresh Prasad', email: 'manager@ccl.gov.in', password: 'manager123', role: UserRole.AreaManager, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '3', name: 'Amit Singh', email: 'dispatch@ccl.gov.in', password: 'dispatch123', role: UserRole.DispatchOfficer, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '4', name: 'Vikram Sharma', email: 'transport@ccl.gov.in', password: 'transport123', role: UserRole.TransportOfficer, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '5', name: 'Priya Verma', email: 'weighbridge@ccl.gov.in', password: 'weighbridge123', role: UserRole.WeighbridgeOperator, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '6', name: 'Deepak Gupta', email: 'auditor@ccl.gov.in', password: 'auditor123', role: UserRole.Auditor, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

const USE_MOCK = true; // Toggle for dev without backend

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      const user = DEMO_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
      if (!user) throw new Error('Invalid credentials');
      const { password: _, ...userData } = user;
      const token = btoa(JSON.stringify({ userId: user._id, role: user.role, exp: Date.now() + 86400000 }));
      return { token, user: userData };
    }
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async getMe(): Promise<User> {
    if (USE_MOCK) {
      const stored = localStorage.getItem('cil_user');
      if (stored) return JSON.parse(stored);
      throw new Error('Not authenticated');
    }
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) {
      await api.post('/auth/logout');
    }
    localStorage.removeItem('cil_token');
    localStorage.removeItem('cil_user');
  },
};
