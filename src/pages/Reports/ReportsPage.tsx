import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDailyReport, useDelayedReport, useVarianceReport, useUtilizationReport, useRouteReport } from '@/hooks/useReports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { Download, FileBarChart, Calendar, TrendingDown, Truck, Route } from 'lucide-react';
import { formatDate, formatHours, formatPercentage, getVarianceColor } from '@/utils/formatters';
import type { ReportFilters } from '@/types/report.types';

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [activeTab, setActiveTab] = useState('daily');

  const { data: dailyData, isLoading: dailyLoading } = useDailyReport(filters);
  const { data: delayedData, isLoading: delayedLoading } = useDelayedReport(filters);
  const { data: varianceData, isLoading: varianceLoading } = useVarianceReport(filters);
  const { data: utilizationData, isLoading: utilizationLoading } = useUtilizationReport(filters);
  const { data: routeData, isLoading: routeLoading } = useRouteReport(filters);

  const handleExport = () => {
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`CIL Transport Report — ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        if (activeTab === 'daily' && dailyData) {
          autoTable(doc, {
            startY: 35,
            head: [['Date', 'Dispatched', 'Delivered', 'Quantity (MT)', 'Avg Transit (hrs)']],
            body: dailyData.map(r => [r.date, r.totalDispatched, r.totalDelivered, r.totalQuantityMT.toFixed(1), r.avgTransitHours.toFixed(1)]),
          });
        } else if (activeTab === 'delayed' && delayedData) {
          autoTable(doc, {
            startY: 35,
            head: [['Trip ID', 'Vehicle', 'Source', 'Destination', 'Delay (hrs)', 'Status']],
            body: delayedData.map(r => [r.tripId, r.vehicleNumber, r.sourceColliery, r.destination, r.delayHours, r.status]),
          });
        } else if (activeTab === 'variance' && varianceData) {
          autoTable(doc, {
            startY: 35,
            head: [['Trip ID', 'Vehicle', 'Source (MT)', 'Dest (MT)', 'Variance %', 'Variance (KG)']],
            body: varianceData.map(r => [r.tripId, r.vehicleNumber, r.sourceWeight, r.destinationWeight, `${r.variancePercentage.toFixed(2)}%`, r.varianceKG]),
          });
        } else if (activeTab === 'utilization' && utilizationData) {
          autoTable(doc, {
            startY: 35,
            head: [['Vehicle', 'Trips', 'Total (MT)', 'Avg/Trip (MT)', 'Utilization %']],
            body: utilizationData.map(r => [r.vehicleNumber, r.totalTrips, r.totalQuantityMT, r.avgQuantityPerTrip, `${r.utilizationPercentage}%`]),
          });
        } else if (activeTab === 'routes' && routeData) {
          autoTable(doc, {
            startY: 35,
            head: [['Route', 'Trips', 'Avg Transit (hrs)', 'Delayed %', 'Total (MT)']],
            body: routeData.map(r => [r.route, r.totalTrips, r.avgTransitHours.toFixed(1), `${r.delayedPercentage}%`, r.totalQuantityMT]),
          });
        }

        doc.save(`cil-report-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyze coal transportation data with detailed reports</p>
        </div>
        <Button className="btn-aurora" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />Export PDF
        </Button>
      </div>

      {/* Date Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" className="w-40" value={filters.startDate || ''} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Input type="date" className="w-40" value={filters.endDate || ''} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
            </div>
            <Button variant="outline" size="sm" onClick={() => setFilters({})}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
          <TabsTrigger value="daily" className="text-xs gap-1.5"><Calendar className="h-3.5 w-3.5" />Daily</TabsTrigger>
          <TabsTrigger value="delayed" className="text-xs gap-1.5"><FileBarChart className="h-3.5 w-3.5" />Delayed</TabsTrigger>
          <TabsTrigger value="variance" className="text-xs gap-1.5"><TrendingDown className="h-3.5 w-3.5" />Variance</TabsTrigger>
          <TabsTrigger value="utilization" className="text-xs gap-1.5"><Truck className="h-3.5 w-3.5" />Utilization</TabsTrigger>
          <TabsTrigger value="routes" className="text-xs gap-1.5"><Route className="h-3.5 w-3.5" />Routes</TabsTrigger>
        </TabsList>

        {/* Daily Report */}
        <TabsContent value="daily" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Daily Dispatch Trend</CardTitle></CardHeader>
            <CardContent>
              {dailyLoading ? <Skeleton className="w-full h-[280px]" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dailyDisp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(213, 70%, 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(213, 70%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 15%, 18%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="totalDispatched" stroke="hsl(213, 70%, 45%)" fill="url(#dailyDisp)" strokeWidth={2} name="Dispatched" />
                    <Area type="monotone" dataKey="totalDelivered" stroke="hsl(142, 70%, 45%)" fill="transparent" strokeWidth={2} name="Delivered" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-0">
              {dailyLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-12" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Dispatched</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Total Qty (MT)</TableHead>
                      <TableHead className="text-right">Avg Transit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyData?.slice(-10).map(r => (
                      <TableRow key={r.date} className="table-row-hover">
                        <TableCell className="text-sm">{formatDate(r.date)}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalDispatched}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalDelivered}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalQuantityMT.toFixed(1)}</TableCell>
                        <TableCell className="font-data text-sm text-right">{formatHours(r.avgTransitHours)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delayed Report */}
        <TabsContent value="delayed" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-0">
              {delayedLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-14" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trip ID</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Expected Arrival</TableHead>
                      <TableHead className="text-right">Delay (hrs)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {delayedData?.map(r => (
                      <TableRow key={r.tripId} className="table-row-hover">
                        <TableCell className="font-data text-sm text-accent">{r.tripId}</TableCell>
                        <TableCell className="font-data text-sm">{r.vehicleNumber}</TableCell>
                        <TableCell className="text-sm">{r.sourceColliery}</TableCell>
                        <TableCell className="text-sm">{r.destination}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(r.expectedArrival)}</TableCell>
                        <TableCell className="font-data text-sm text-right text-warning">{r.delayHours}h</TableCell>
                        <TableCell><Badge variant="warning">{r.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Report */}
        <TabsContent value="variance" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-0">
              {varianceLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-14" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trip ID</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Source Weight (MT)</TableHead>
                      <TableHead className="text-right">Dest Weight (MT)</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                      <TableHead className="text-right">Variance (KG)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {varianceData?.map(r => (
                      <TableRow key={r.tripId} className="table-row-hover">
                        <TableCell className="font-data text-sm text-accent">{r.tripId}</TableCell>
                        <TableCell className="font-data text-sm">{r.vehicleNumber}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.sourceWeight.toFixed(2)}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.destinationWeight.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-data text-sm ${getVarianceColor(r.variancePercentage)}`}>{formatPercentage(r.variancePercentage)}</span>
                        </TableCell>
                        <TableCell className="font-data text-sm text-right text-destructive">{r.varianceKG.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilization Report */}
        <TabsContent value="utilization" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Vehicle Utilization</CardTitle></CardHeader>
            <CardContent>
              {utilizationLoading ? <Skeleton className="w-full h-[280px]" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={utilizationData} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 15%, 18%)" />
                    <XAxis dataKey="vehicleNumber" tick={{ fontSize: 9, fill: 'hsl(215, 15%, 55%)' }} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="utilizationPercentage" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} barSize={24} name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-0">
              {utilizationLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-12" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Total Trips</TableHead>
                      <TableHead className="text-right">Total Qty (MT)</TableHead>
                      <TableHead className="text-right">Avg/Trip (MT)</TableHead>
                      <TableHead className="text-right">Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilizationData?.map(r => (
                      <TableRow key={r.vehicleNumber} className="table-row-hover">
                        <TableCell className="font-data text-sm text-accent">{r.vehicleNumber}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalTrips}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalQuantityMT.toLocaleString()}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.avgQuantityPerTrip}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={r.utilizationPercentage >= 80 ? 'success' : r.utilizationPercentage >= 60 ? 'warning' : 'destructive'}>
                            {r.utilizationPercentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Report */}
        <TabsContent value="routes" className="space-y-4 mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Route Performance</CardTitle></CardHeader>
            <CardContent>
              {routeLoading ? <Skeleton className="w-full h-[280px]" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={routeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 15%, 18%)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                    <YAxis dataKey="route" type="category" width={170} tick={{ fontSize: 9, fill: 'hsl(215, 15%, 55%)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 15%, 11%)', border: '1px solid hsl(217, 15%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="totalTrips" fill="hsl(213, 70%, 45%)" radius={[0, 4, 4, 0]} barSize={12} name="Total Trips" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-0">
              {routeLoading ? (
                <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-12" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-right">Trips</TableHead>
                      <TableHead className="text-right">Avg Transit</TableHead>
                      <TableHead className="text-right">Delayed %</TableHead>
                      <TableHead className="text-right">Total Qty (MT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routeData?.map(r => (
                      <TableRow key={r.route} className="table-row-hover">
                        <TableCell className="text-sm">{r.route}</TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalTrips}</TableCell>
                        <TableCell className="font-data text-sm text-right">{formatHours(r.avgTransitHours)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-data text-sm ${r.delayedPercentage > 10 ? 'text-destructive' : r.delayedPercentage > 5 ? 'text-warning' : 'text-success'}`}>
                            {formatPercentage(r.delayedPercentage)}
                          </span>
                        </TableCell>
                        <TableCell className="font-data text-sm text-right">{r.totalQuantityMT.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
