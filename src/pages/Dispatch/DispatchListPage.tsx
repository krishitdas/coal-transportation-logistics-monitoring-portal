import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips, useCreateTrip, useDeleteTrip } from '@/hooks/useTrips';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Trash2 } from 'lucide-react';
import { TripStatus, CoalType } from '@/types/trip.types';
import type { TripCreateInput, TripFilters } from '@/types/trip.types';
import { STATUS_LABELS } from '@/utils/constants';
import { getTripStatusColor, formatDateTime } from '@/utils/formatters';
import { COLLIERIES, DESTINATIONS } from '@/utils/constants';

export default function DispatchListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TripFilters>({ page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useTrips(filters);
  const { data: vehicles } = useVehicles();
  const createTrip = useCreateTrip();
  const deleteTrip = useDeleteTrip();

  const [form, setForm] = useState<TripCreateInput>({
    vehicleId: '', driverName: '', sourceColliery: COLLIERIES[0], destination: DESTINATIONS[0],
    coalType: CoalType.GradeI, authorizedQuantityMT: 25, dispatchDate: new Date().toISOString().slice(0, 16),
    expectedArrival: new Date(Date.now() + 12 * 3600000).toISOString().slice(0, 16),
  });

  const handleSearch = () => setFilters(f => ({ ...f, search: searchInput, page: 1 }));

  const handleCreate = () => {
    createTrip.mutate(form, { onSuccess: () => { setCreateOpen(false); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispatch Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage coal transportation dispatches</p>
        </div>
        <Button className="btn-aurora" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Dispatch
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search trips, vehicles, routes..." className="pl-9" value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
            </div>
            <Select value={filters.status || 'all'} onValueChange={v => setFilters(f => ({ ...f, status: v === 'all' ? undefined : v as TripStatus, page: 1 }))}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(TripStatus).map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleSearch}>Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-14" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Source → Destination</TableHead>
                  <TableHead>Coal Type</TableHead>
                  <TableHead>Qty (MT)</TableHead>
                  <TableHead>Dispatch Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map(trip => (
                  <TableRow key={trip._id} className="table-row-hover cursor-pointer" onClick={() => navigate(`/dispatch/${trip._id}`)}>
                    <TableCell className="font-data text-accent text-sm">{trip.tripId}</TableCell>
                    <TableCell className="font-data text-sm">{trip.vehicle?.vehicleNumber || '—'}</TableCell>
                    <TableCell className="text-sm">{trip.driverName}</TableCell>
                    <TableCell className="text-sm truncate max-w-[220px]">{trip.sourceColliery} → {trip.destination}</TableCell>
                    <TableCell className="text-sm">{trip.coalType}</TableCell>
                    <TableCell className="font-data text-sm">{trip.authorizedQuantityMT}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(trip.dispatchDate)}</TableCell>
                    <TableCell><Badge variant="outline" className={getTripStatusColor(trip.status)}>{STATUS_LABELS[trip.status]}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); deleteTrip.mutate(trip._id); }}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}>Previous</Button>
          <span className="flex items-center text-sm text-muted-foreground">Page {data.page} of {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={data.page >= data.totalPages} onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}>Next</Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Dispatch</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={form.vehicleId} onValueChange={v => setForm(f => ({ ...f, vehicleId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>{vehicles?.filter(v => v.active).map(v => <SelectItem key={v._id} value={v._id}>{v.vehicleNumber}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input value={form.driverName} onChange={e => setForm(f => ({ ...f, driverName: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Colliery</Label>
                <Select value={form.sourceColliery} onValueChange={v => setForm(f => ({ ...f, sourceColliery: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COLLIERIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Select value={form.destination} onValueChange={v => setForm(f => ({ ...f, destination: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DESTINATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coal Type</Label>
                <Select value={form.coalType} onValueChange={v => setForm(f => ({ ...f, coalType: v as CoalType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.values(CoalType).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity (MT)</Label>
                <Input type="number" value={form.authorizedQuantityMT} onChange={e => setForm(f => ({ ...f, authorizedQuantityMT: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dispatch Date</Label>
                <Input type="datetime-local" value={form.dispatchDate} onChange={e => setForm(f => ({ ...f, dispatchDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Expected Arrival</Label>
                <Input type="datetime-local" value={form.expectedArrival} onChange={e => setForm(f => ({ ...f, expectedArrival: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="btn-aurora" onClick={handleCreate} disabled={createTrip.isPending}>Create Dispatch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
