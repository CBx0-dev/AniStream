import type { ReactNode } from 'react';

export interface FeatureCardProps {
  icon: ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
}

export function FeatureCard({
  icon,
  iconBgClass,
  iconColorClass,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-fd-border bg-fd-card p-5 transition-all hover:border-fd-primary/40">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ring-1 transition-colors ${iconBgClass} ${iconColorClass}`}
      >
        {icon}
      </div>
      <h3 className="mt-3 text-base font-semibold text-fd-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-fd-muted-foreground leading-relaxed sm:text-sm">
        {description}
      </p>
    </div>
  );
}
