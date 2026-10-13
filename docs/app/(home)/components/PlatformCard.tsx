import type { ReactNode } from 'react';

export function PlatformCard({
  icon,
  name,
  badge,
}: {
  icon: ReactNode;
  name: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-fd-border bg-fd-card p-3.5 text-center transition-all hover:border-fd-primary/30">
      <span className="text-2xl flex items-center justify-center text-fd-foreground">
        {icon}
      </span>
      <span className="mt-2 text-xs font-medium text-fd-foreground">{name}</span>
      <span className="text-[10px] text-fd-muted-foreground">{badge}</span>
    </div>
  );
}

export function DeployCard({
  icon,
  name,
}: {
  icon: ReactNode;
  name: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card p-3 text-center transition-all hover:border-fd-primary/30">
      <span className="text-xl flex items-center justify-center text-fd-foreground">
        {icon}
      </span>
      <span className="text-xs font-medium text-fd-foreground">{name}</span>
    </div>
  );
}
