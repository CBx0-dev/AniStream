import type { ReactNode } from 'react';

export function ProviderCard({
  logo,
  name,
  subtitle,
}: {
  logo: ReactNode;
  name: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-fd-border bg-fd-card p-5 text-center transition-all hover:border-fd-primary/40">
      <div className="h-10 w-full flex items-center justify-center">
        {logo}
      </div>
      <span className="mt-2.5 text-xs font-semibold text-fd-foreground sm:text-sm">
        {name}
      </span>
      <span className="text-[10px] sm:text-xs text-fd-muted-foreground">
        {subtitle}
      </span>
    </div>
  );
}
