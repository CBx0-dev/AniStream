import Link from 'next/link';
import { LucidePcCase } from '@/components/icons/LucidePcCase';
import { LucideCloud } from '@/components/icons/LucideCloud';
import { LucideDownload } from '@/components/icons/LucideDownload';
import { LucideServer } from '@/components/icons/LucideServer';
import { LucideArrowRight } from '@/components/icons/LucideArrowRight';
import { ArchitectureCard } from './ArchitectureCard';

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative flex w-full flex-col justify-center border-t border-fd-border/50 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3.5rem)] lg:py-0 lg:px-8 snap-start snap-always"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Choose the Architecture That Fits You
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-fd-muted-foreground sm:text-sm md:text-base">
            Whether you want an instant zero-config desktop app or a centralized 24/7 home server
            stack, AniStream has you covered.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ArchitectureCard
            badgeIcon={<LucidePcCase />}
            badgeText="Standalone Mode"
            badgeColorClass="bg-indigo-500/10 text-indigo-500 ring-indigo-500/20"
            tag="Zero Setup"
            title="Standalone Desktop App"
            description="All-in-one local client for single-user viewing. Everything runs on your machine with zero server requirements."
            features={[
              'Embedded local scraping engine',
              'Local SQLite database for watch progress',
              'Complete privacy: operates entirely on your machine',
              'Native installers for Windows, Linux, and macOS',
            ]}
            ctaLink="/docs/standalone/install"
            ctaText="Install Standalone Client"
            ctaIcon={<LucideDownload />}
            ctaButtonClass="bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
          />

          <ArchitectureCard
            badgeIcon={<LucideCloud />}
            badgeText="Client & Server Stack"
            badgeColorClass="bg-purple-500/10 text-purple-500 ring-purple-500/20"
            tag="Multi-Device"
            title="Self-Hosted Server Stack"
            description="Centralized backend server with background workers, multi-user profiles, and cross-device sync."
            features={[
              '24/7 background catalog synchronization & worker',
              'Multi-user accounts with isolated watch states',
              'Thin client desktop builds connecting over REST API',
              'One-click CapRover and Docker Compose deployment',
            ]}
            ctaLink="/docs/client/setup-intro"
            ctaText="Deploy Server Stack"
            ctaIcon={<LucideServer />}
            ctaButtonClass="border border-fd-border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent"
          />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/docs/comparison"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-fd-primary hover:underline"
          >
            See the full detailed comparison between Standalone and Client/Server modes
            <span className="h-3.5 w-3.5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <LucideArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
