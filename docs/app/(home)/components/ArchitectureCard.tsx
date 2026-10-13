import Link from 'next/link';
import type { ReactNode } from 'react';
import { LucideCheck } from '@/components/icons/LucideCheck';
import { LucideArrowRight } from '@/components/icons/LucideArrowRight';

export interface ArchitectureCardProps {
  badgeIcon: ReactNode;
  badgeText: string;
  badgeColorClass: string;
  tag: string;
  title: string;
  description: string;
  features: string[];
  ctaLink: string;
  ctaText: string;
  ctaIcon: ReactNode;
  ctaButtonClass: string;
}

export function ArchitectureCard({
  badgeIcon,
  badgeText,
  badgeColorClass,
  tag,
  title,
  description,
  features,
  ctaLink,
  ctaText,
  ctaIcon,
  ctaButtonClass,
}: ArchitectureCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-fd-border bg-linear-to-b from-fd-card to-fd-muted/30 p-6 sm:p-7">
      <div>
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold ring-1 ${badgeColorClass}`}
          >
            <span className="text-base flex items-center">{badgeIcon}</span>
            {badgeText}
          </div>
          <span className="text-xs font-medium text-fd-muted-foreground">{tag}</span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-fd-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1.5 text-xs text-fd-muted-foreground sm:text-sm">
          {description}
        </p>

        <ul className="mt-5 space-y-2.5 text-xs text-fd-foreground sm:text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <span className="h-3.5 w-3.5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                  <LucideCheck />
                </span>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-5 border-t border-fd-border/60">
        <Link
          href={ctaLink}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${ctaButtonClass}`}
        >
          <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
            {ctaIcon}
          </span>
          {ctaText}
          <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
            <LucideArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
}
