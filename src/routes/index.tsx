import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const DispatchListPage = lazy(() => import('@/pages/Dispatch/DispatchListPage'));
const DispatchDetailPage = lazy(() => import('@/pages/Dispatch/DispatchDetailPage'));
const FleetPage = lazy(() => import('@/pages/Fleet/FleetPage'));
const RouteMonitoringPage = lazy(() => import('@/pages/RouteMonitoring/RouteMonitoringPage'));
const WeighbridgePage = lazy(() => import('@/pages/Weighbridge/WeighbridgePage'));
const ReportsPage = lazy(() => import('@/pages/Reports/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  { path: '/login', element: <SuspenseWrap><LoginPage /></SuspenseWrap> },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrap><DashboardPage /></SuspenseWrap> },
      { path: 'dispatch', element: <SuspenseWrap><DispatchListPage /></SuspenseWrap> },
      { path: 'dispatch/:id', element: <SuspenseWrap><DispatchDetailPage /></SuspenseWrap> },
      { path: 'fleet', element: <SuspenseWrap><FleetPage /></SuspenseWrap> },
      { path: 'monitoring', element: <SuspenseWrap><RouteMonitoringPage /></SuspenseWrap> },
      { path: 'weighbridge', element: <SuspenseWrap><WeighbridgePage /></SuspenseWrap> },
      { path: 'reports', element: <SuspenseWrap><ReportsPage /></SuspenseWrap> },
      { path: 'settings', element: <SuspenseWrap><SettingsPage /></SuspenseWrap> },
    ],
  },
]);
