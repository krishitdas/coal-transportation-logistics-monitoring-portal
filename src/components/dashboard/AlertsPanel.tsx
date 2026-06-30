import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlerts } from '@/hooks/useAlerts';
import { useAcknowledgeAlert } from '@/hooks/useAlerts';
import { SEVERITY_COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';
import { AlertTriangle, Bell, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const typeIcons: Record<string, React.ReactNode> = {
  Delay: <AlertTriangle className="h-4 w-4 text-warning" />,
  WeightVariance: <Shield className="h-4 w-4 text-destructive" />,
  VehicleExpiry: <Bell className="h-4 w-4 text-accent" />,
  RouteDeviation: <AlertTriangle className="h-4 w-4 text-orange-400" />,
};

export function AlertsPanel() {
  const { data: alerts, isLoading } = useAlerts();
  const ack = useAcknowledgeAlert();
  const active = alerts?.filter(a => a.status !== 'Resolved') || [];

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><Skeleton className="w-28 h-5" /></CardHeader>
        <CardContent>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-16 mb-2" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          <Badge variant="outline" className="text-[10px]">{active.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[360px] px-6">
          <div className="space-y-3">
            {active.map(alert => (
              <div key={alert._id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                {typeIcons[alert.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-[10px] ${SEVERITY_COLORS[alert.severity]}`}>
                      {alert.severity}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(alert.createdAt)}</span>
                  </div>
                </div>
                {alert.status === 'Active' && (
                  <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={() => ack.mutate(alert._id)}>
                    <CheckCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-success" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
