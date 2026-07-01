import { useState } from 'react';
import { useWeighbridgeEntries, useCreateWeighbridgeEntry, useUpdateWeighbridgeEntry } from '@/hooks/useWeighbridge';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Scale, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';
import type { WeighbridgeCreateInput } from '@/types/weighbridge.types';
import { formatDateTime, formatWeight, getVarianceColor } from '@/utils/formatters';

function VarianceIndicator({ variance }: { variance: number }) {
  if (variance === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const color = getVarianceColor(variance);
  const icon = Math.abs(variance) <= 1 ? <CheckCircle className="h-3.5 w-3.5" /> : Math.abs(variance) <= 3 ? <TrendingDown className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />;
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {icon}
      <span className="font-data text-xs">{variance.toFixed(2)}%</span>
    </div>
  );
}

export default function WeighbridgePage() {
  const { data: entries, isLoading } = useWeighbridgeEntries();
  const { data: tripsData } = useTrips({ limit: 50 });
  const createEntry = useCreateWeighbridgeEntry();
  const updateEntry = useUpdateWeighbridgeEntry();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateId, setUpdateId] = useState('');

  const [form, setForm] = useState<WeighbridgeCreateInput>({
    tripId: '', tareWeight: 0, grossWeight: 0, destinationWeight: 0,
  });

  const [destForm, setDestForm] = useState({ destinationWeight: 0 });

  const netWeight = form.grossWeight - form.tareWeight;
  const variance = form.destinationWeight && netWeight ? ((form.destinationWeight - netWeight) / netWeight) * 100 : 0;

  const tripsWithoutEntry = tripsData?.data.filter(t => !entries?.some(e => e.tripId === t._id)) || [];

  const handleCreate = () => {
    createEntry.mutate(form, { onSuccess: () => { setCreateOpen(false); setForm({ tripId: '', tareWeight: 0, grossWeight: 0, destinationWeight: 0 }); } });
  };

  const handleUpdate = () => {
    updateEntry.mutate({ id: updateId, input: { destinationWeight: destForm.destinationWeight } }, { onSuccess: () => setUpdateOpen(false) });
  };

  // Summary stats
  const totalEntries = entries?.length || 0;
  const avgVariance = entries && entries.length > 0
    ? entries.filter(e => e.variancePercentage !== 0).reduce((acc, e) => acc + Math.abs(e.variancePercentage), 0) / (entries.filter(e => e.variancePercentage !== 0).length || 1)
    : 0;
  const highVarianceCount = entries?.filter(e => Math.abs(e.variancePercentage) > 3).length || 0;
  const pendingDest = entries?.filter(e => e.destinationWeight === 0).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weighbridge Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Record and monitor weighbridge entries &amp; weight variance</p>
        </div>
        <Button className="btn-aurora" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: totalEntries, icon: <Scale className="h-4 w-4 text-primary" /> },
          { label: 'Avg Variance', value: `${avgVariance.toFixed(2)}%`, icon: <TrendingDown className="h-4 w-4 text-warning" /> },
          { label: 'High Variance (>3%)', value: highVarianceCount, icon: <AlertTriangle className="h-4 w-4 text-destructive" /> },
          { label: 'Pending Dest. Weight', value: pendingDest, icon: <Scale className="h-4 w-4 text-accent" /> },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-muted-foreground">{s.label}</span></div>
              <p className="text-2xl font-bold font-data">{s.value}</p>
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
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Tare (MT)</TableHead>
                  <TableHead className="text-right">Gross (MT)</TableHead>
                  <TableHead className="text-right">Net (MT)</TableHead>
                  <TableHead className="text-right">Dest (MT)</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries?.map(entry => (
                  <TableRow key={entry._id} className="table-row-hover">
                    <TableCell className="font-data text-sm text-accent">{entry.trip?.tripId || entry.tripId}</TableCell>
                    <TableCell className="font-data text-sm">{entry.trip?.vehicle?.vehicleNumber || '—'}</TableCell>
                    <TableCell className="text-sm truncate max-w-[180px]">
                      {entry.trip ? `${entry.trip.sourceColliery} → ${entry.trip.destination}` : '—'}
                    </TableCell>
                    <TableCell className="font-data text-sm text-right">{formatWeight(entry.tareWeight)}</TableCell>
                    <TableCell className="font-data text-sm text-right">{formatWeight(entry.grossWeight)}</TableCell>
                    <TableCell className="font-data text-sm text-right">{formatWeight(entry.netWeight)}</TableCell>
                    <TableCell className="font-data text-sm text-right">
                      {entry.destinationWeight > 0 ? formatWeight(entry.destinationWeight) : <span className="text-muted-foreground">Pending</span>}
                    </TableCell>
                    <TableCell><VarianceIndicator variance={entry.variancePercentage} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.recordedBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(entry.createdAt)}</TableCell>
                    <TableCell>
                      {entry.destinationWeight === 0 && (
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => { setUpdateId(entry._id); setDestForm({ destinationWeight: 0 }); setUpdateOpen(true); }}>
                          + Dest
                        </Button>
                      )}
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
          <DialogHeader><DialogTitle>Record Weighbridge Entry</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Trip</Label>
              <Select value={form.tripId} onValueChange={v => setForm(f => ({ ...f, tripId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select trip" /></SelectTrigger>
                <SelectContent>
                  {tripsWithoutEntry.map(t => (
                    <SelectItem key={t._id} value={t._id}>{t.tripId} — {t.vehicle?.vehicleNumber || 'No vehicle'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tare Weight (MT)</Label>
                <Input type="number" step="0.1" value={form.tareWeight || ''} onChange={e => setForm(f => ({ ...f, tareWeight: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Gross Weight (MT)</Label>
                <Input type="number" step="0.1" value={form.grossWeight || ''} onChange={e => setForm(f => ({ ...f, grossWeight: Number(e.target.value) }))} />
              </div>
            </div>
            {/* Auto-calculated Net Weight */}
            {netWeight > 0 && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Calculated Net Weight</span>
                  <span className="font-data text-sm font-bold text-accent">{formatWeight(netWeight)}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Destination Weight (MT) <span className="text-muted-foreground text-xs">— optional</span></Label>
              <Input type="number" step="0.1" value={form.destinationWeight || ''} onChange={e => setForm(f => ({ ...f, destinationWeight: Number(e.target.value) }))} />
            </div>
            {variance !== 0 && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weight Variance</span>
                  <VarianceIndicator variance={variance} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="btn-aurora" onClick={handleCreate} disabled={createEntry.isPending || !form.tripId}>Record Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Destination Weight Dialog */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Destination Weight</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Destination Weight (MT)</Label>
              <Input type="number" step="0.1" value={destForm.destinationWeight || ''} onChange={e => setDestForm({ destinationWeight: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button className="btn-aurora" onClick={handleUpdate} disabled={updateEntry.isPending}>Update Weight</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
