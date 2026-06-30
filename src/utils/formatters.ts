import { format, formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy, HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatWeight(weightMT: number): string {
  return `${weightMT.toFixed(2)} MT`;
}

export function formatWeightKG(weightKG: number): string {
  return `${weightKG.toLocaleString()} KG`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours.toFixed(1)} hrs`;
}

export function getDelayHours(expected: string, actual?: string): number {
  const expectedDate = parseISO(expected);
  const actualDate = actual ? parseISO(actual) : new Date();
  return Math.max(0, differenceInHours(actualDate, expectedDate));
}

export function getVarianceColor(variance: number): string {
  if (Math.abs(variance) <= 1) return 'text-success';
  if (Math.abs(variance) <= 3) return 'text-warning';
  return 'text-destructive';
}

export function getTripStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Loading: 'status-loading',
    InTransit: 'status-intransit',
    Delivered: 'status-delivered',
    Delayed: 'status-delayed',
    Flagged: 'status-flagged',
  };
  return colors[status] || '';
}
