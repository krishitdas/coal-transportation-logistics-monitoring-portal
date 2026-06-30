import type { Trip, TripFilters, PaginatedResponse, TripCreateInput, TripUpdateInput } from '@/types/trip.types';
import { TripStatus, CoalType } from '@/types/trip.types';
import api from './api';

const MOCK_TRIPS: Trip[] = [
  { _id: '1', tripId: 'CCL-2025-00001', vehicleId: 'v1', vehicle: { _id: 'v1', vehicleNumber: 'JH-01-AB-1234', transporterName: 'Jharkhand Transport Co.' }, driverName: 'Ramesh Yadav', sourceColliery: 'Rajrappa Colliery', destination: 'NTPC Kahalgaon', coalType: CoalType.GradeI, authorizedQuantityMT: 25, dispatchDate: '2025-06-28T06:00:00Z', expectedArrival: '2025-06-28T18:00:00Z', actualArrival: '2025-06-28T17:30:00Z', status: TripStatus.Delivered, createdBy: '1', createdAt: '2025-06-28T05:00:00Z', updatedAt: '2025-06-28T17:30:00Z' },
  { _id: '2', tripId: 'CCL-2025-00002', vehicleId: 'v2', vehicle: { _id: 'v2', vehicleNumber: 'JH-02-CD-5678', transporterName: 'Eastern Carriers Pvt. Ltd.' }, driverName: 'Sunil Kumar', sourceColliery: 'Kathara Colliery', destination: 'DVC Chandrapura', coalType: CoalType.GradeII, authorizedQuantityMT: 20, dispatchDate: '2025-06-28T07:00:00Z', expectedArrival: '2025-06-28T14:00:00Z', status: TripStatus.InTransit, createdBy: '1', createdAt: '2025-06-28T06:30:00Z', updatedAt: '2025-06-28T10:00:00Z' },
  { _id: '3', tripId: 'CCL-2025-00003', vehicleId: 'v3', vehicle: { _id: 'v3', vehicleNumber: 'JH-03-EF-9012', transporterName: 'CCL Fleet Services' }, driverName: 'Manoj Singh', sourceColliery: 'Dakra Colliery', destination: 'SAIL Bokaro', coalType: CoalType.GradeIII, authorizedQuantityMT: 22, dispatchDate: '2025-06-29T05:30:00Z', expectedArrival: '2025-06-29T12:00:00Z', status: TripStatus.Loading, createdBy: '3', createdAt: '2025-06-29T05:00:00Z', updatedAt: '2025-06-29T05:30:00Z' },
  { _id: '4', tripId: 'CCL-2025-00004', vehicleId: 'v4', vehicle: { _id: 'v4', vehicleNumber: 'JH-04-GH-3456', transporterName: 'Bihar Roadways Ltd.' }, driverName: 'Arvind Prasad', sourceColliery: 'Piparwar Colliery', destination: 'NTPC Barh', coalType: CoalType.Steam, authorizedQuantityMT: 28, dispatchDate: '2025-06-27T06:00:00Z', expectedArrival: '2025-06-27T20:00:00Z', actualArrival: '2025-06-28T02:00:00Z', status: TripStatus.Delayed, createdBy: '3', createdAt: '2025-06-27T05:00:00Z', updatedAt: '2025-06-28T02:00:00Z' },
  { _id: '5', tripId: 'CCL-2025-00005', vehicleId: 'v5', vehicle: { _id: 'v5', vehicleNumber: 'JH-05-IJ-7890', transporterName: 'Ranchi Freight Corp.' }, driverName: 'Sanjay Mehta', sourceColliery: 'Ashoka Colliery', destination: 'TATA Steel Jamshedpur', coalType: CoalType.WasheryGradeI, authorizedQuantityMT: 24, dispatchDate: '2025-06-29T08:00:00Z', expectedArrival: '2025-06-29T20:00:00Z', status: TripStatus.InTransit, createdBy: '1', createdAt: '2025-06-29T07:30:00Z', updatedAt: '2025-06-29T12:00:00Z' },
  { _id: '6', tripId: 'CCL-2025-00006', vehicleId: 'v6', vehicle: { _id: 'v6', vehicleNumber: 'JH-06-KL-2345', transporterName: 'Dhanbad Logistics' }, driverName: 'Prakash Roy', sourceColliery: 'Magadh Colliery', destination: 'Hindalco Renukoot', coalType: CoalType.GradeI, authorizedQuantityMT: 26, dispatchDate: '2025-06-29T06:00:00Z', expectedArrival: '2025-06-30T06:00:00Z', status: TripStatus.Flagged, createdBy: '3', createdAt: '2025-06-29T05:30:00Z', updatedAt: '2025-06-29T15:00:00Z' },
  { _id: '7', tripId: 'CCL-2025-00007', vehicleId: 'v7', vehicle: { _id: 'v7', vehicleNumber: 'JH-07-MN-6789', transporterName: 'Coal Movers India' }, driverName: 'Vijay Thakur', sourceColliery: 'Amrapali Colliery', destination: 'NSPCL Bhilai', coalType: CoalType.GradeII, authorizedQuantityMT: 23, dispatchDate: '2025-06-28T09:00:00Z', expectedArrival: '2025-06-29T09:00:00Z', actualArrival: '2025-06-29T08:00:00Z', status: TripStatus.Delivered, createdBy: '1', createdAt: '2025-06-28T08:30:00Z', updatedAt: '2025-06-29T08:00:00Z' },
  { _id: '8', tripId: 'CCL-2025-00008', vehicleId: 'v8', vehicle: { _id: 'v8', vehicleNumber: 'JH-08-OP-0123', transporterName: 'National Bulk Carriers' }, driverName: 'Deepak Tiwari', sourceColliery: 'Kedla Colliery', destination: 'DPL Durgapur', coalType: CoalType.Slack, authorizedQuantityMT: 21, dispatchDate: '2025-06-29T07:00:00Z', expectedArrival: '2025-06-29T22:00:00Z', status: TripStatus.InTransit, createdBy: '3', createdAt: '2025-06-29T06:30:00Z', updatedAt: '2025-06-29T14:00:00Z' },
  { _id: '9', tripId: 'CCL-2025-00009', vehicleId: 'v1', vehicle: { _id: 'v1', vehicleNumber: 'JH-01-AB-1234', transporterName: 'Jharkhand Transport Co.' }, driverName: 'Ramesh Yadav', sourceColliery: 'Rajrappa Colliery', destination: 'CESC Budge Budge', coalType: CoalType.GradeI, authorizedQuantityMT: 25, dispatchDate: '2025-06-30T06:00:00Z', expectedArrival: '2025-06-30T22:00:00Z', status: TripStatus.Loading, createdBy: '1', createdAt: '2025-06-30T05:00:00Z', updatedAt: '2025-06-30T05:30:00Z' },
  { _id: '10', tripId: 'CCL-2025-00010', vehicleId: 'v3', vehicle: { _id: 'v3', vehicleNumber: 'JH-03-EF-9012', transporterName: 'CCL Fleet Services' }, driverName: 'Manoj Singh', sourceColliery: 'North Urimari Colliery', destination: 'Adani Power Tiroda', coalType: CoalType.WasheryGradeII, authorizedQuantityMT: 27, dispatchDate: '2025-06-26T05:00:00Z', expectedArrival: '2025-06-27T05:00:00Z', actualArrival: '2025-06-27T04:00:00Z', status: TripStatus.Delivered, createdBy: '3', createdAt: '2025-06-26T04:30:00Z', updatedAt: '2025-06-27T04:00:00Z' },
];

const USE_MOCK = true;

export const tripService = {
  async getTrips(filters?: TripFilters): Promise<PaginatedResponse<Trip>> {
    if (USE_MOCK) {
      let filtered = [...MOCK_TRIPS];
      if (filters?.status) filtered = filtered.filter(t => t.status === filters.status);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(t => t.tripId.toLowerCase().includes(s) || t.vehicle?.vehicleNumber.toLowerCase().includes(s) || t.driverName.toLowerCase().includes(s) || t.sourceColliery.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s));
      }
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      return { data: filtered.slice(start, start + limit), total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) };
    }
    const { data } = await api.get<PaginatedResponse<Trip>>('/trips', { params: filters });
    return data;
  },

  async getTrip(id: string): Promise<Trip> {
    if (USE_MOCK) {
      const trip = MOCK_TRIPS.find(t => t._id === id);
      if (!trip) throw new Error('Trip not found');
      return trip;
    }
    const { data } = await api.get<Trip>(`/trips/${id}`);
    return data;
  },

  async createTrip(input: TripCreateInput): Promise<Trip> {
    if (USE_MOCK) {
      const newTrip: Trip = { _id: String(MOCK_TRIPS.length + 1), tripId: `CCL-2025-${String(MOCK_TRIPS.length + 1).padStart(5, '0')}`, ...input, status: TripStatus.Loading, createdBy: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_TRIPS.push(newTrip);
      return newTrip;
    }
    const { data } = await api.post<Trip>('/trips', input);
    return data;
  },

  async updateTrip(id: string, input: TripUpdateInput): Promise<Trip> {
    if (USE_MOCK) {
      const idx = MOCK_TRIPS.findIndex(t => t._id === id);
      if (idx === -1) throw new Error('Trip not found');
      MOCK_TRIPS[idx] = { ...MOCK_TRIPS[idx], ...input, updatedAt: new Date().toISOString() };
      return MOCK_TRIPS[idx];
    }
    const { data } = await api.put<Trip>(`/trips/${id}`, input);
    return data;
  },

  async deleteTrip(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_TRIPS.findIndex(t => t._id === id);
      if (idx !== -1) MOCK_TRIPS.splice(idx, 1);
      return;
    }
    await api.delete(`/trips/${id}`);
  },
};
