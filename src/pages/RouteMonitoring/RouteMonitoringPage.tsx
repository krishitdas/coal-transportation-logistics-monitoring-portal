import { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useCheckpoints, useCreateCheckpoint } from '@/hooks/useCheckpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TripStatus } from '@/types/trip.types';
import { STATUS_LABELS, CHECKPOINTS } from '@/utils/constants';
import { getTripStatusColor, formatDateTime } from '@/utils/formatters';
import { MapPin, Plus, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RouteMonitoringPage() {
  const { data: tripsData, isLoading } = useTrips({ limit: 50 });
  const activeTrips = tripsData?.data.filter(t => t.status === TripStatus.InTransit || t.status === TripStatus.Delayed || t.status === TripStatus.Loading) || [];
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [addOpen, setAddOpen] = useState(false);

  const { data: checkpoints, isLoading: cpLoading } = useCheckpoints(selectedTripId);
  const createCheckpoint = useCreateCheckpoint();

  const [cpForm, setCpForm] = useState({
    checkpointName: CHECKPOINTS[0] as string,
    timestamp: new Date().toISOString().slice(0, 16),
    remarks: '',
  });

  const handleAddCheckpoint = () => {
    if (!selectedTripId) return;
    createCheckpoint.mutate(
      { tripId: selectedTripId, checkpointName: cpForm.checkpointName, timestamp: cpForm.timestamp, remarks: cpForm.remarks },
      { onSuccess: () => { setAddOpen(false); setCpForm({ checkpointName: CHECKPOINTS[0] as string, timestamp: new Date().toISOString().slice(0, 16), remarks: '' }); } }
    );
  };

  const selectedTrip = tripsData?.data.find(t => t._id === selectedTripId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Route Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Track active trips and log route checkpoints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips List */}
        <div className="lg:col-span-1">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Active Trips ({activeTrips.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  {activeTrips.map(trip => (
                    <button
                      key={trip._id}
                      onClick={() => setSelectedTripId(trip._id)}
                      className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors ${selectedTripId === trip._id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-data text-sm text-accent">{trip.tripId}</span>
                        <Badge variant="outline" className={`text-[10px] ${getTripStatusColor(trip.status)}`}>{STATUS_LABELS[trip.status]}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{trip.sourceColliery} → {trip.destination}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{trip.vehicle?.vehicleNumber || '—'} · {trip.driverName}</p>
                    </button>
                  ))}
                  {activeTrips.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No active trips</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline & Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTripId && selectedTrip ? (
            <>
              {/* Trip Header */}
              <Card className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold font-data">{selectedTrip.tripId}</h2>
                        <Badge variant="outline" className={getTripStatusColor(selectedTrip.status)}>{STATUS_LABELS[selectedTrip.status]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <MapPin className="inline h-3.5 w-3.5 mr-1" />
                        {selectedTrip.sourceColliery} → {selectedTrip.destination}
                      </p>
                    </div>
                    <Button className="btn-aurora" onClick={() => setAddOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />Log Checkpoint
                    </Button>
                  </div>
                  <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
                    <span><Clock className="inline h-3.5 w-3.5 mr-1" />Dispatched: {formatDateTime(selectedTrip.dispatchDate)}</span>
                    <span><Clock className="inline h-3.5 w-3.5 mr-1" />Expected: {formatDateTime(selectedTrip.expectedArrival)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Checkpoint Timeline */}
              <Card className="border-border/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Route Timeline</CardTitle></CardHeader>
                <CardContent>
                  {cpLoading ? (
                    <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
                  ) : checkpoints && checkpoints.length > 0 ? (
                    <div className="relative pl-8">
                      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
                      {checkpoints.map((cp, i) => (
                        <div key={cp._id} className="relative mb-8 last:mb-0">
                          <div className={`absolute left-[-25px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === checkpoints.length - 1 ? 'border-accent bg-accent/20' : 'border-primary/30 bg-card'}`}>
                            {i === checkpoints.length - 1 ? (
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3 text-primary/50" />
                            )}
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-3 border border-border/30">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{cp.checkpointName}</p>
                              <span className="text-[11px] text-muted-foreground">{formatDateTime(cp.timestamp)}</span>
                            </div>
                            {cp.remarks && <p className="text-xs text-muted-foreground mt-1.5 italic">"{cp.remarks}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-12 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mb-2 opacity-40" />
                      <p className="text-sm">No checkpoints logged yet</p>
                      <p className="text-xs mt-1">Click "Log Checkpoint" to add the first entry</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <MapPin className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Select a trip from the list to view its route</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* All Trips Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm">All Trip Checkpoint Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dispatch</TableHead>
                <TableHead>Expected Arrival</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tripsData?.data.slice(0, 10).map(trip => (
                <TableRow key={trip._id} className="table-row-hover cursor-pointer" onClick={() => setSelectedTripId(trip._id)}>
                  <TableCell className="font-data text-sm text-accent">{trip.tripId}</TableCell>
                  <TableCell className="text-sm">{trip.vehicle?.vehicleNumber || '—'}</TableCell>
                  <TableCell className="text-sm truncate max-w-[200px]">{trip.sourceColliery} → {trip.destination}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${getTripStatusColor(trip.status)}`}>{STATUS_LABELS[trip.status]}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(trip.dispatchDate)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(trip.expectedArrival)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Checkpoint Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Checkpoint</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Checkpoint</Label>
              <Select value={cpForm.checkpointName} onValueChange={v => setCpForm(f => ({ ...f, checkpointName: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHECKPOINTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timestamp</Label>
              <Input type="datetime-local" value={cpForm.timestamp} onChange={e => setCpForm(f => ({ ...f, timestamp: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Optional remarks..." value={cpForm.remarks} onChange={e => setCpForm(f => ({ ...f, remarks: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="btn-aurora" onClick={handleAddCheckpoint} disabled={createCheckpoint.isPending}>Log Checkpoint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
