import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '@/hooks/useTrips';
import { useCheckpoints } from '@/hooks/useCheckpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Truck, MapPin, Calendar, Weight, User } from 'lucide-react';
import { STATUS_LABELS } from '@/utils/constants';
import { getTripStatusColor, formatDateTime } from '@/utils/formatters';

export default function DispatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading } = useTrip(id || '');
  const { data: checkpoints } = useCheckpoints(id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="grid grid-cols-2 gap-6"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
      </div>
    );
  }

  if (!trip) return <div className="text-center py-12 text-muted-foreground">Trip not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dispatch')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight font-data">{trip.tripId}</h1>
            <Badge variant="outline" className={getTripStatusColor(trip.status)}>{STATUS_LABELS[trip.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{trip.sourceColliery} → {trip.destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Details */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-sm">Trip Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <DetailRow icon={<Truck className="h-4 w-4" />} label="Vehicle" value={trip.vehicle?.vehicleNumber || '—'} />
            <DetailRow icon={<User className="h-4 w-4" />} label="Driver" value={trip.driverName} />
            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Source" value={trip.sourceColliery} />
            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Destination" value={trip.destination} />
            <Separator />
            <DetailRow icon={<Weight className="h-4 w-4" />} label="Coal Type" value={trip.coalType} />
            <DetailRow icon={<Weight className="h-4 w-4" />} label="Authorized Qty" value={`${trip.authorizedQuantityMT} MT`} mono />
            <Separator />
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Dispatch Date" value={formatDateTime(trip.dispatchDate)} />
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Expected Arrival" value={formatDateTime(trip.expectedArrival)} />
            {trip.actualArrival && <DetailRow icon={<Calendar className="h-4 w-4" />} label="Actual Arrival" value={formatDateTime(trip.actualArrival)} />}
          </CardContent>
        </Card>

        {/* Route Checkpoints */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-sm">Route Checkpoints</CardTitle></CardHeader>
          <CardContent>
            {checkpoints && checkpoints.length > 0 ? (
              <div className="relative pl-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                {checkpoints.map((cp, i) => (
                  <div key={cp._id} className="relative mb-6 last:mb-0">
                    <div className={`absolute left-[-21px] w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${i === checkpoints.length - 1 ? 'border-accent bg-accent/20' : 'border-border bg-card'}`}>
                      <div className={`w-2 h-2 rounded-full ${i === checkpoints.length - 1 ? 'bg-accent' : 'bg-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cp.checkpointName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(cp.timestamp)}</p>
                      {cp.remarks && <p className="text-xs text-muted-foreground mt-1 italic">{cp.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No checkpoints logged yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground w-28">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-data' : ''}`}>{value}</span>
    </div>
  );
}
