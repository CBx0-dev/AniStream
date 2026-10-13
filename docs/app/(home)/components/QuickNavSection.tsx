import Link from 'next/link';
import { gitConfig } from '@/lib/shared';
import { LucideBookOpen } from '@/components/icons/LucideBookOpen';
import { LucideDownload } from '@/components/icons/LucideDownload';
import { LucideServer } from '@/components/icons/LucideServer';
import { LucideLayers } from '@/components/icons/LucideLayers';
import { LucideArrowRight } from '@/components/icons/LucideArrowRight';
import { DeviconGithub } from '@/components/icons/DeviconGithub';
import { QuickNavCard, type QuickNavCardProps } from './QuickNavCard';

const QUICK_LINKS: QuickNavCardProps[] = [
  {
    href: '/docs',
    icon: <LucideBookOpen />,
    iconColorClass: 'text-indigo-500',
    title: 'Introduction',
    description: 'Overview of AniStream architecture and features.',
  },
  {
    href: '/docs/standalone/install',
    icon: <LucideDownload />,
    iconColorClass: 'text-purple-500',
    title: 'Install Standalone',
    description: 'Desktop app setup for Windows, Linux, and macOS.',
  },
  {
    href: '/docs/client/setup-intro',
    icon: <LucideServer />,
    iconColorClass: 'text-pink-500',
    title: 'Server Setup',
    description: 'CapRover and Docker Compose deployment guide.',
  },
  {
    href: '/docs/comparison',
    icon: <LucideLayers />,
    iconColorClass: 'text-emerald-500',
    title: 'Mode Comparison',
    description: 'Detailed side-by-side feature comparison table.',
  },
];

export function QuickNavSection() {
  const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <section
      id="quick-nav"
      className="relative flex w-full flex-col justify-center border-t border-fd-border/50 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3.5rem)] lg:py-0 lg:px-8 snap-start snap-always"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Ready to Start Streaming?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-fd-muted-foreground sm:text-sm md:text-base">
            Explore step-by-step installation guides, deployment manuals, and feature comparisons.
          </p>
        </div>

        <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <QuickNavCard key={link.title} {...link} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-fd-border/70 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5 text-center backdrop-blur-sm sm:p-6">
          <h3 className="text-lg font-bold text-fd-foreground sm:text-xl">
            Get Started with AniStream Today
          </h3>
          <p className="mx-auto mt-1 max-w-lg text-xs text-fd-muted-foreground sm:text-sm">
            Free, open-source, and engineered for maximum playback performance.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl bg-fd-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-fd-primary-foreground shadow-md transition-all hover:bg-fd-primary/90 hover:scale-[1.02]"
            >
              <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                <LucideBookOpen />
              </span>
              Open Documentation
              <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                <LucideArrowRight />
              </span>
            </Link>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-card px-5 py-2.5 text-xs sm:text-sm font-medium text-fd-foreground transition-all hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                <DeviconGithub />
              </span>
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
