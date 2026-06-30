import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Truck, Weight, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { KPI } from '@/types/dashboard.types';

const iconMap: Record<string, React.ReactNode> = {
  truck: <Truck className="h-5 w-5" />,
  weight: <Weight className="h-5 w-5" />,
  fleet: <Users className="h-5 w-5" />,
  clock: <Clock className="h-5 w-5" />,
  check: <CheckCircle className="h-5 w-5" />,
  alert: <AlertTriangle className="h-5 w-5" />,
};

export function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const isPositive = kpi.changeType === 'increase' ? kpi.change > 0 : kpi.change < 0;

  return (
    <Card className="kpi-card border-border/50 overflow-hidden" style={{ animationDelay: `${index * 80}ms` }}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            {iconMap[kpi.icon] || <Truck className="h-5 w-5" />}
          </div>
          <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-success' : 'text-destructive')}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(kpi.change)}{kpi.unit === '%' ? 'pp' : '%'}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold font-data animate-count-up">
            {typeof kpi.value === 'number' && kpi.value >= 1000 ? kpi.value.toLocaleString() : kpi.value}
            {kpi.unit && kpi.unit !== '%' && <span className="text-sm font-normal text-muted-foreground ml-1">{kpi.unit}</span>}
            {kpi.unit === '%' && <span className="text-sm font-normal text-muted-foreground">%</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPIGrid({ kpis, isLoading }: { kpis?: KPI[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-20 h-8 mt-3" />
              <Skeleton className="w-24 h-3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis?.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} index={i} />)}
    </div>
  );
}
