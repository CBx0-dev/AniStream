import Link from 'next/link';
import { gitConfig } from '@/lib/shared';
import { LucideBookOpen } from '@/components/icons/LucideBookOpen';
import { LucideArrowRight } from '@/components/icons/LucideArrowRight';
import { LucideLayers } from '@/components/icons/LucideLayers';
import { LucideExternalLink } from '@/components/icons/LucideExternalLink';
import { DeviconGithub } from '@/components/icons/DeviconGithub';
import { ScrollDownButton } from '@/components/SectionNav';

export function HeroSection() {
  const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <section
      id="hero"
      className="relative flex w-full flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3.5rem)] lg:py-0 lg:px-8 snap-start snap-always"
    >
      <div className="mx-auto w-full max-w-5xl text-center">
        {/* Main Title */}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Stream Anime, Series & more{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Without Compromise
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm text-fd-muted-foreground sm:text-base md:text-lg leading-relaxed">
          A lightweight, high-performance desktop client and media manager. Ad-free streaming from
          AniWorld.to and S.TO with native scrapers, instant watch history, and flexible standalone
          or self-hosted deployment.
        </p>

        {/* Hero CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:mt-8">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/20 transition-all hover:bg-fd-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <LucideBookOpen />
            </span>
            Explore Documentation
            <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <LucideArrowRight />
            </span>
          </Link>

          <Link
            href="/docs/comparison"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-5 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-md transition-all hover:border-fd-primary/40 hover:bg-fd-accent hover:text-fd-accent-foreground hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <LucideLayers />
            </span>
            Choose Your Setup
          </Link>

          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-fd-border bg-fd-card/80 px-5 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-md transition-all hover:border-fd-primary/40 hover:bg-fd-accent hover:text-fd-accent-foreground hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="h-4 w-4 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <DeviconGithub />
            </span>
            GitHub
            <span className="h-3.5 w-3.5 opacity-60 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <LucideExternalLink />
            </span>
          </a>
        </div>
        <div className="mt-6">
          <ScrollDownButton targetId="features" />
        </div>
      </div>
    </section>
  );
}
