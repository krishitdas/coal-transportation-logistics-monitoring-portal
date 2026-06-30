import { useKPIs, useTrends, useStatusDistribution, useRouteUtilization } from '@/hooks/useDashboard';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { DispatchTrendChart } from '@/components/dashboard/DispatchTrendChart';
import { StatusDistChart } from '@/components/dashboard/StatusDistChart';
import { RouteUtilChart } from '@/components/dashboard/RouteUtilChart';
import { LiveTripsTable } from '@/components/dashboard/LiveTripsTable';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: trends, isLoading: trendsLoading } = useTrends();
  const { data: statusDist, isLoading: statusLoading } = useStatusDistribution();
  const { data: routeUtil, isLoading: routeLoading } = useRouteUtilization();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time coal transportation monitoring & analytics</p>
      </div>

      {/* KPIs */}
      <KPIGrid kpis={kpis} isLoading={kpisLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DispatchTrendChart data={trends} isLoading={trendsLoading} />
        </div>
        <StatusDistChart data={statusDist} isLoading={statusLoading} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveTripsTable />
        </div>
        <AlertsPanel />
      </div>

      {/* Route Utilization */}
      <RouteUtilChart data={routeUtil} isLoading={routeLoading} />
    </div>
  );
}
