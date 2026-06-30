import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LayoutDashboard, Truck, Package, Route, Scale, FileBarChart, Settings, Search } from 'lucide-react';

const commands = [
  { label: 'Go to Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/dashboard' },
  { label: 'Go to Dispatch', icon: <Package className="h-4 w-4" />, path: '/dispatch' },
  { label: 'Go to Fleet', icon: <Truck className="h-4 w-4" />, path: '/fleet' },
  { label: 'Go to Route Monitoring', icon: <Route className="h-4 w-4" />, path: '/monitoring' },
  { label: 'Go to Weighbridge', icon: <Scale className="h-4 w-4" />, path: '/weighbridge' },
  { label: 'Go to Reports', icon: <FileBarChart className="h-4 w-4" />, path: '/reports' },
  { label: 'Go to Settings', icon: <Settings className="h-4 w-4" />, path: '/settings' },
];

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg overflow-hidden">
        <Command className="rounded-lg border-none bg-transparent">
          <div className="flex items-center border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground ml-2"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigation" className="text-xs text-muted-foreground px-2 py-1.5">
              {commands.map((cmd) => (
                <Command.Item
                  key={cmd.path}
                  value={cmd.label}
                  onSelect={() => { navigate(cmd.path); onOpenChange(false); setSearch(''); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm cursor-pointer hover:bg-secondary data-[selected=true]:bg-secondary"
                >
                  <span className="text-muted-foreground">{cmd.icon}</span>
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
