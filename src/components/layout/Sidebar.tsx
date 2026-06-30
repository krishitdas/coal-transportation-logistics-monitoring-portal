import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';
import {
  LayoutDashboard, Truck, Package, Route, Scale, FileBarChart, Settings, ChevronLeft, ChevronRight, HardHat,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.AreaManager, UserRole.DispatchOfficer, UserRole.TransportOfficer, UserRole.WeighbridgeOperator, UserRole.Auditor] },
  { label: 'Dispatch', path: '/dispatch', icon: <Package className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.AreaManager, UserRole.DispatchOfficer, UserRole.Auditor] },
  { label: 'Fleet', path: '/fleet', icon: <Truck className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.AreaManager, UserRole.TransportOfficer] },
  { label: 'Route Monitoring', path: '/monitoring', icon: <Route className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.AreaManager, UserRole.DispatchOfficer, UserRole.TransportOfficer, UserRole.Auditor] },
  { label: 'Weighbridge', path: '/weighbridge', icon: <Scale className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.WeighbridgeOperator] },
  { label: 'Reports', path: '/reports', icon: <FileBarChart className="h-5 w-5" />, roles: [UserRole.Admin, UserRole.AreaManager, UserRole.DispatchOfficer, UserRole.TransportOfficer, UserRole.WeighbridgeOperator, UserRole.Auditor] },
  { label: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" />, roles: [UserRole.Admin] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role as UserRole));

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar-background border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[240px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20">
            <HardHat className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-foreground tracking-tight truncate">CIL Transport</h1>
              <p className="text-[10px] text-muted-foreground truncate">Coal Logistics Portal</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const link = (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-accent border-l-2 border-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <span className={cn(isActive ? 'text-accent' : 'text-muted-foreground')}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
