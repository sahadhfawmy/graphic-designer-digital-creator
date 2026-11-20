import React, { useCallback, useEffect, useState } from 'react';
import { AboutSection, ServicesSection } from './components/AboutServices';
import { ContactSection, Footer } from './components/ContactFooter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header, Hero, Marquee, Preloader } from './components/Header';
import { SkillsSection, WhySection } from './components/SkillsWhy';
import { WorkSection } from './components/WorkSection';
import { FirebaseProvider } from './context/FirebaseContext';
import { scrollToEl, useReveal } from './utils/hooks';

function PortfolioShell() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  });
  const [loading, setLoading] = useState(true);
  const [interest, setInterest] = useState({ title: '', id: 0 });

  useReveal(!loading);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('sf-theme', theme);
    } catch {
      // ignore storage errors
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#06060a' : '#f3f0e9');
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', loading);
    return () => document.body.classList.remove('no-scroll');
  }, [loading]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleLoaderDone = useCallback(() => {
    setLoading(false);
  }, []);

  const handleSelectService = useCallback((title: string) => {
    setInterest({ title, id: Date.now() });
    scrollToEl(document.getElementById('contact'), 'start');
    window.setTimeout(() => {
      document.getElementById('brief-service')?.focus({ preventScroll: true });
    }, 750);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-[0.75rem] focus:font-semibold focus:uppercase focus:tracking-[0.12em] focus:text-[#16120b]"
      >
        Skip to content
      </a>
      {loading && <Preloader onDone={handleLoaderDone} />}
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <Hero />
        <Marquee />
        <AboutSection />
        <ServicesSection onSelectService={handleSelectService} />
        <WorkSection />
        <SkillsSection />
        <WhySection />
        <ContactSection interest={interest} />
      </main>
      <Footer theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <PortfolioShell />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
