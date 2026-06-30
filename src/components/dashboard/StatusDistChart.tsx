import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { StatusDistribution } from '@/types/dashboard.types';
import { STATUS_LABELS } from '@/utils/constants';

export function StatusDistChart({ data, isLoading }: { data?: StatusDistribution[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><Skeleton className="w-40 h-5" /></CardHeader>
        <CardContent><Skeleton className="w-full h-[280px]" /></CardContent>
      </Card>
    );
  }

  const chartData = data?.map(d => ({ ...d, name: STATUS_LABELS[d.status] || d.status }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Trip Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} strokeWidth={0}>
              {chartData?.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value: string) => <span style={{ color: 'hsl(210, 20%, 82%)' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
