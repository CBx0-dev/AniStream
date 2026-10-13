import { SectionNav } from '@/components/SectionNav';
import {
  AmbientGlow,
  HeroSection,
  FeaturesSection,
  ArchitectureSection,
  EcosystemSection,
  QuickNavSection,
} from './components';

export default function HomePage() {
  return (
    <div id="home-page" className="relative flex min-h-screen flex-col">
      <AmbientGlow />
      <SectionNav />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <EcosystemSection />
      <QuickNavSection />
    </div>
  );
}
