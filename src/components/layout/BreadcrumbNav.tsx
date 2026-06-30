import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  dispatch: 'Dispatch Management',
  fleet: 'Fleet Management',
  monitoring: 'Route Monitoring',
  weighbridge: 'Weighbridge',
  reports: 'Reports',
  settings: 'Settings',
};

export default function BreadcrumbNav() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Home className="h-3.5 w-3.5 text-muted-foreground" />
      {segments.map((segment, i) => (
        <span key={segment} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className={i === segments.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
            {routeLabels[segment] || segment}
          </span>
        </span>
      ))}
    </nav>
  );
}
