import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RouteUtilization } from '@/types/dashboard.types';

export function RouteUtilChart({ data, isLoading }: { data?: RouteUtilization[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><Skeleton className="w-40 h-5" /></CardHeader>
        <CardContent><Skeleton className="w-full h-[280px]" /></CardContent>
      </Card>
    );
  }

  const chartData = data?.map(d => ({ ...d, shortRoute: d.route.length > 25 ? d.route.slice(0, 25) + '…' : d.route }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Route Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 15%, 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 55%)' }} />
            <YAxis dataKey="shortRoute" type="category" width={150} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="trips" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} barSize={16} name="Trips" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
