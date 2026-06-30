import { useAuth } from '@/context/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { Bell, LogOut, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLE_LABELS } from '@/utils/constants';
import BreadcrumbNav from './BreadcrumbNav';

interface HeaderProps {
  onSearchOpen: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const { data: alerts } = useAlerts();
  const activeAlerts = alerts?.filter(a => a.status === 'Active').length || 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-4">
        <BreadcrumbNav />
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 text-muted-foreground w-64 justify-start" onClick={onSearchOpen}>
          <Search className="h-4 w-4" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Alerts Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {activeAlerts > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {activeAlerts}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground">{user?.role ? ROLE_LABELS[user.role] : ''}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
