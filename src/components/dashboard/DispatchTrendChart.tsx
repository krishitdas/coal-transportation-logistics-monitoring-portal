import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DispatchTrend } from '@/types/dashboard.types';

export function DispatchTrendChart({ data, isLoading }: { data?: DispatchTrend[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><Skeleton className="w-40 h-5" /></CardHeader>
        <CardContent><Skeleton className="w-full h-[280px]" /></CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Dispatch Trend (14 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(213, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(213, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 15%, 18%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 15%, 55%)' }} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="dispatched" stroke="hsl(213, 70%, 45%)" fill="url(#colorDispatched)" strokeWidth={2} name="Dispatched" />
            <Area type="monotone" dataKey="delivered" stroke="hsl(142, 70%, 45%)" fill="url(#colorDelivered)" strokeWidth={2} name="Delivered" />
            <Area type="monotone" dataKey="delayed" stroke="hsl(38, 92%, 50%)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" name="Delayed" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
