import Link from 'next/link';
import type { ReactNode } from 'react';
import { LucideArrowRight } from '@/components/icons/LucideArrowRight';

export interface QuickNavCardProps {
  href: string;
  icon: ReactNode;
  iconColorClass: string;
  title: string;
  description: string;
}

export function QuickNavCard({
  href,
  icon,
  iconColorClass,
  title,
  description,
}: QuickNavCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-fd-border bg-fd-card p-4 transition-all hover:border-fd-primary/50 hover:bg-fd-accent/50"
    >
      <div className="flex items-center justify-between">
        <span className={`h-5 w-5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full ${iconColorClass}`}>
          {icon}
        </span>
        <span className="h-3.5 w-3.5 text-fd-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-fd-foreground flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
          <LucideArrowRight />
        </span>
      </div>
      <h4 className="mt-3 text-sm font-semibold text-fd-foreground">{title}</h4>
      <p className="mt-1 text-xs text-fd-muted-foreground">{description}</p>
    </Link>
  );
}
