import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTrips } from '@/hooks/useTrips';
import { STATUS_LABELS } from '@/utils/constants';
import { getTripStatusColor } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export function LiveTripsTable() {
  const { data, isLoading } = useTrips({ limit: 5 });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><Skeleton className="w-32 h-5" /></CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-12 mb-2" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Recent Trips</CardTitle>
          <button onClick={() => navigate('/dispatch')} className="text-xs text-accent hover:underline">View all →</button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Trip ID</TableHead>
              <TableHead className="text-xs">Vehicle</TableHead>
              <TableHead className="text-xs">Route</TableHead>
              <TableHead className="text-xs">Qty (MT)</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map(trip => (
              <TableRow key={trip._id} className="table-row-hover cursor-pointer" onClick={() => navigate(`/dispatch/${trip._id}`)}>
                <TableCell className="font-data text-xs text-accent">{trip.tripId}</TableCell>
                <TableCell className="text-xs">{trip.vehicle?.vehicleNumber || '—'}</TableCell>
                <TableCell className="text-xs truncate max-w-[180px]">{trip.sourceColliery} → {trip.destination}</TableCell>
                <TableCell className="font-data text-xs">{trip.authorizedQuantityMT}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTripStatusColor(trip.status)}>
                    {STATUS_LABELS[trip.status] || trip.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
