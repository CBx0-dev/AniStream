import { DeviconWindows11 } from '@/components/icons/DeviconWindows11';
import { DeviconLinux } from '@/components/icons/DeviconLinux';
import { DeviconApple } from '@/components/icons/DeviconApple';
import { DeviconDocker } from '@/components/icons/DeviconDocker';
import { CapRover } from '@/components/icons/CapRover';
import { Aniworld } from '@/components/icons/Aniworld';
import { Sto } from '@/components/icons/Sto';
import { PlatformCard, DeployCard } from './PlatformCard';
import { ProviderCard } from './ProviderCard';

export function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative flex w-full flex-col justify-center border-t border-fd-border/50 bg-fd-muted/20 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3.5rem)] lg:py-0 lg:px-8 snap-start snap-always"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Broad Compatibility & Native Integration
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-fd-muted-foreground sm:text-sm md:text-base">
            Run natively on your favourite operating system and stream from premier anime and
            series catalogs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-fd-border bg-fd-card/60 p-6 backdrop-blur-sm">
            <div>
              <h3 className="text-lg font-bold text-fd-foreground sm:text-xl">
                Runs Natively Everywhere
              </h3>
              <p className="mt-1.5 text-xs text-fd-muted-foreground sm:text-sm">
                Desktop clients compiled for major operating systems and server containers ready
                for deployment.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <PlatformCard
                  icon={<DeviconWindows11 />}
                  name="Windows"
                  badge=".exe / .msi"
                />
                <PlatformCard
                  icon={<DeviconLinux />}
                  name="Linux"
                  badge=".deb / AppImage"
                />
                <PlatformCard
                  icon={<DeviconApple />}
                  name="macOS"
                  badge=".dmg"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <DeployCard
                  icon={<DeviconDocker />}
                  name="Docker & Compose"
                />
                <DeployCard
                  icon={<CapRover className="h-4 w-4 object-contain" />}
                  name="CapRover One-Click"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-fd-border bg-fd-card/60 p-6 backdrop-blur-sm">
            <div>
              <h3 className="text-lg font-bold text-fd-foreground sm:text-xl">
                Supported Streaming Providers
              </h3>
              <p className="mt-1.5 text-xs text-fd-muted-foreground sm:text-sm">
                Direct integration with leading anime and TV series streaming platforms.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3.5">
                <ProviderCard
                  logo={<Aniworld className="max-h-7 w-auto object-contain" />}
                  name="AniWorld.to"
                  subtitle="Anime Catalog"
                />
                <ProviderCard
                  logo={<Sto className="max-h-7 w-auto object-contain" />}
                  name="S.TO"
                  subtitle="TV Series Catalog"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
