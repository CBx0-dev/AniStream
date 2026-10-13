import { LucidePlayCircle } from '@/components/icons/LucidePlayCircle';
import { LucideRadar } from '@/components/icons/LucideRadar';
import { LucideHistory } from '@/components/icons/LucideHistory';
import { LucideWorkflow } from '@/components/icons/LucideWorkflow';
import { LucideLanguages } from '@/components/icons/LucideLanguages';
import { LucideZap } from '@/components/icons/LucideZap';
import { FeatureCard, type FeatureCardProps } from './FeatureCard';

const FEATURES: FeatureCardProps[] = [
  {
    icon: <LucidePlayCircle />,
    iconBgClass: 'bg-indigo-500/10 ring-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white',
    iconColorClass: 'text-indigo-500',
    title: 'Ad-Free Direct Streaming',
    description:
      'Direct HLS and MP4 video playback. No banners, no popups, no redirects, and no tracking scripts. Just the clean video player.',
  },
  {
    icon: <LucideRadar />,
    iconBgClass: 'bg-purple-500/10 ring-purple-500/20 group-hover:bg-purple-500 group-hover:text-white',
    iconColorClass: 'text-purple-500',
    title: 'Built-in Provider Scrapers',
    description:
      'Native scrapers for AniWorld.to (Anime) and S.TO (Series). Browse full catalogs, seasons, languages, and episodes directly in-app.',
  },
  {
    icon: <LucideHistory />,
    iconBgClass: 'bg-pink-500/10 ring-pink-500/20 group-hover:bg-pink-500 group-hover:text-white',
    iconColorClass: 'text-pink-500',
    title: 'Smart Watch Progress',
    description:
      'Automatic bookmarks and playback position tracking. Resume exactly where you left off across sessions without losing your spot.',
  },
  {
    icon: <LucideWorkflow />,
    iconBgClass: 'bg-blue-500/10 ring-blue-500/20 group-hover:bg-blue-500 group-hover:text-white',
    iconColorClass: 'text-blue-500',
    title: 'Dual Deployment Modes',
    description:
      'Choose what fits your style: a standalone offline-ready desktop client, or a multi-user client connected to a self-hosted server.',
  },
  {
    icon: <LucideLanguages />,
    iconBgClass: 'bg-emerald-500/10 ring-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white',
    iconColorClass: 'text-emerald-500',
    title: 'English & German Localization',
    description:
      'Fully translated UI with effortless language switching and native support for German dubs, subbed anime, and original audio releases.',
  },
  {
    icon: (
      <span className="h-5 w-5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        <LucideZap />
      </span>
    ),
    iconBgClass: 'bg-amber-500/10 ring-amber-500/20 group-hover:bg-amber-500 group-hover:text-white',
    iconColorClass: 'text-amber-500',
    title: 'Rust & Tauri Architecture',
    description:
      'Ultra-low resource usage, minimal memory footprint, and instant responsiveness powered by Rust and Vue 3 instead of heavy Electron runtimes.',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative flex w-full flex-col justify-center border-t border-fd-border/50 bg-fd-muted/20 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3.5rem)] lg:py-0 lg:px-8 snap-start snap-always"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Engineered for Pure Streaming Pleasure
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-fd-muted-foreground sm:text-sm md:text-base">
            AniStream is built to eliminate ads, redirects, and bloat so you can focus on enjoying
            your anime and shows.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
