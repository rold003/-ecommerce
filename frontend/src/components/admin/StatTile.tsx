import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}

export function StatTile({ label, value, icon: Icon, hint }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
        <Icon className="h-4 w-4 text-neutral-400" />
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </Card>
  );
}
