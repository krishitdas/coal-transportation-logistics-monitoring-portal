import type { UserRecord, UserCreateInput, UserUpdateInput } from '@/types/user.types';
import { UserRole } from '@/types/auth.types';
import api from './api';

const MOCK_USERS: UserRecord[] = [
  { _id: '1', name: 'Rajesh Kumar', email: 'admin@ccl.gov.in', role: UserRole.Admin, active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { _id: '2', name: 'Suresh Prasad', email: 'manager@ccl.gov.in', role: UserRole.AreaManager, active: true, createdAt: '2025-01-15', updatedAt: '2025-01-15' },
  { _id: '3', name: 'Amit Singh', email: 'dispatch@ccl.gov.in', role: UserRole.DispatchOfficer, active: true, createdAt: '2025-02-01', updatedAt: '2025-02-01' },
  { _id: '4', name: 'Vikram Sharma', email: 'transport@ccl.gov.in', role: UserRole.TransportOfficer, active: true, createdAt: '2025-02-15', updatedAt: '2025-02-15' },
  { _id: '5', name: 'Priya Verma', email: 'weighbridge@ccl.gov.in', role: UserRole.WeighbridgeOperator, active: true, createdAt: '2025-03-01', updatedAt: '2025-03-01' },
  { _id: '6', name: 'Deepak Gupta', email: 'auditor@ccl.gov.in', role: UserRole.Auditor, active: true, createdAt: '2025-03-15', updatedAt: '2025-03-15' },
];

const USE_MOCK = true;

export const userService = {
  async getUsers(): Promise<UserRecord[]> {
    if (USE_MOCK) return MOCK_USERS;
    const { data } = await api.get<UserRecord[]>('/users');
    return data;
  },

  async createUser(input: UserCreateInput): Promise<UserRecord> {
    if (USE_MOCK) {
      const newUser: UserRecord = { _id: String(MOCK_USERS.length + 1), name: input.name, email: input.email, role: input.role, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_USERS.push(newUser);
      return newUser;
    }
    const { data } = await api.post<UserRecord>('/users', input);
    return data;
  },

  async updateUser(id: string, input: UserUpdateInput): Promise<UserRecord> {
    if (USE_MOCK) {
      const idx = MOCK_USERS.findIndex(u => u._id === id);
      if (idx === -1) throw new Error('User not found');
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...input, role: input.role ?? MOCK_USERS[idx].role, updatedAt: new Date().toISOString() };
      return MOCK_USERS[idx];
    }
    const { data } = await api.put<UserRecord>(`/users/${id}`, input);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_USERS.findIndex(u => u._id === id);
      if (idx !== -1) MOCK_USERS.splice(idx, 1);
      return;
    }
    await api.delete(`/users/${id}`);
  },
};
