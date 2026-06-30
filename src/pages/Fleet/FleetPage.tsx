import { useState } from 'react';
import { useVehicles, useCreateVehicle, useDeleteVehicle } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import type { VehicleCreateInput } from '@/types/vehicle.types';
import { formatDate } from '@/utils/formatters';
import { TRANSPORTERS } from '@/utils/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function isExpiringSoon(dateStr: string): boolean {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 3600000;
}

function isExpired(dateStr: string): boolean {
  return new Date(dateStr).getTime() < Date.now();
}

export default function FleetPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<VehicleCreateInput>({
    vehicleNumber: '', transporterName: TRANSPORTERS[0], capacityMT: 25,
    insuranceExpiry: '', fitnessExpiry: '', pucExpiry: '',
  });

  const handleCreate = () => {
    createVehicle.mutate(form, { onSuccess: () => setCreateOpen(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vehicles and compliance documents</p>
        </div>
        <Button className="btn-aurora" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Add Vehicle
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vehicles', value: vehicles?.length || 0 },
          { label: 'Active', value: vehicles?.filter(v => v.active).length || 0 },
          { label: 'Expiring Soon', value: vehicles?.filter(v => isExpiringSoon(v.insuranceExpiry) || isExpiringSoon(v.fitnessExpiry) || isExpiringSoon(v.pucExpiry)).length || 0 },
          { label: 'Expired Docs', value: vehicles?.filter(v => isExpired(v.insuranceExpiry) || isExpired(v.fitnessExpiry) || isExpired(v.pucExpiry)).length || 0 },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-2xl font-bold font-data">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-14" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Transporter</TableHead>
                  <TableHead>Capacity (MT)</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Fitness</TableHead>
                  <TableHead>PUC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles?.map(v => (
                  <TableRow key={v._id} className="table-row-hover">
                    <TableCell className="font-data text-sm text-accent">{v.vehicleNumber}</TableCell>
                    <TableCell className="text-sm">{v.transporterName}</TableCell>
                    <TableCell className="font-data text-sm">{v.capacityMT}</TableCell>
                    <ExpiryCell date={v.insuranceExpiry} />
                    <ExpiryCell date={v.fitnessExpiry} />
                    <ExpiryCell date={v.pucExpiry} />
                    <TableCell>
                      <Badge variant={v.active ? 'success' : 'secondary'}>{v.active ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteVehicle.mutate(v._id)}>
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Vehicle</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input placeholder="JH-XX-XX-XXXX" value={form.vehicleNumber} onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Capacity (MT)</Label>
                <Input type="number" value={form.capacityMT} onChange={e => setForm(f => ({ ...f, capacityMT: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Transporter</Label>
              <Select value={form.transporterName} onValueChange={v => setForm(f => ({ ...f, transporterName: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TRANSPORTERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Insurance Expiry</Label><Input type="date" value={form.insuranceExpiry} onChange={e => setForm(f => ({ ...f, insuranceExpiry: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Fitness Expiry</Label><Input type="date" value={form.fitnessExpiry} onChange={e => setForm(f => ({ ...f, fitnessExpiry: e.target.value }))} /></div>
              <div className="space-y-2"><Label>PUC Expiry</Label><Input type="date" value={form.pucExpiry} onChange={e => setForm(f => ({ ...f, pucExpiry: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="btn-aurora" onClick={handleCreate} disabled={createVehicle.isPending}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExpiryCell({ date }: { date: string }) {
  const expired = isExpired(date);
  const expiring = isExpiringSoon(date);
  return (
    <TableCell className="text-sm">
      <div className="flex items-center gap-1.5">
        {(expired || expiring) && <AlertTriangle className={`h-3.5 w-3.5 ${expired ? 'text-destructive' : 'text-warning'}`} />}
        <span className={expired ? 'text-destructive' : expiring ? 'text-warning' : 'text-muted-foreground'}>{formatDate(date)}</span>
      </div>
    </TableCell>
  );
}
