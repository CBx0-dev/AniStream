'use client';

import { useEffect, useState } from 'react';
import { LucideChevronDown } from '@/components/icons/LucideChevronDown';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'Overview' },
  { id: 'features', label: 'Core Features' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'quick-nav', label: 'Get Started' },
];

export function SectionNav() {
  const [activeId, setActiveId] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section Navigation"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollTo(section.id)}
            aria-label={`Scroll to ${section.label}`}
            className="group relative flex items-center gap-2 py-1 focus:outline-none"
          >
            {/* Tooltip Label */}
            <span
              className="pointer-events-none opacity-0 group-hover:opacity-100 rounded-md border border-fd-border/50 bg-fd-card/90 px-2.5 py-1 text-xs font-medium text-fd-foreground shadow-sm backdrop-blur-md transition-all duration-200"
            >
              {section.label}
            </span>

            {/* Indicator Dot */}
            <span
              className={`relative flex items-center justify-center transition-all duration-300 ${
                isActive ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5 group-hover:scale-125'
              }`}
            >
              <span
                className={`h-full w-full rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-fd-primary shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                    : 'bg-fd-muted-foreground/40 group-hover:bg-fd-primary/70'
                }`}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function ScrollDownButton({ targetId = 'features' }: { targetId?: string }) {
  const scrollTo = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollTo}
      aria-label="Scroll to next section"
      className="group mx-auto hidden cursor-pointer items-center justify-center rounded-full p-2 text-fd-muted-foreground transition-all duration-300 hover:text-fd-primary lg:flex"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100">
          Scroll
        </span>
        <span className="h-4 w-4 animate-bounce transition-transform group-hover:translate-y-0.5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full">
          <LucideChevronDown />
        </span>
      </div>
    </button>
  );
}
